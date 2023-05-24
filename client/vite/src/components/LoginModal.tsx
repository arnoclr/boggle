import { FormEvent, createRef, useEffect, useRef, useState } from "react";
import { ErrorWithStatus, callAction, toMap } from "../utils/req";
import { webauthnRegister } from "../utils/webauthnRegister";
import { webauthnAuthenticate } from "../utils/webauthnAuthenticate";
import "./LoginModal.css";
import {
  addInList,
  addInListIfNotPresent,
  getList,
  removeFromList,
} from "../utils/storage";
import AccountsSelector from "./AccountsSelector";

export interface Account {
  email: string;
  authMethod: "password" | "webauthn";
}

export default function LoginModal() {
  const [section, setSection] = useState<
    "email" | "code" | "name" | "accountSelection"
  >("email");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [defaultUserName, setDefaultUserName] = useState<string | null>(null);
  const [previousAccounts, setPreviousAccounts] = useState<Account[]>([]);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const isDialogOpen = (): boolean => !!dialogRef.current?.open;

  function synchronizeAccounts() {
    setPreviousAccounts(getList("previousAccounts"));
  }

  function checkLoginStatus() {
    setLoading(true);
    synchronizeAccounts();
    callAction("amIConnected", toMap({}))
      .then((res) => {
        const reasonToOpenModal =
          res.data.connected === false || res.data.suggestNameChange;
        isDialogOpen() === false &&
          reasonToOpenModal &&
          dialogRef.current?.showModal();
        if (res.data.suggestNameChange) {
          setSection("name");
          setDefaultUserName(res.data.currentName);
        }

        if (reasonToOpenModal === false) {
          closeModal();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmail(e.currentTarget.email.value);
  };

  useEffect(() => {
    email && loginWithEmail();
  }, [email]);

  async function loginWithEmail(): Promise<void> {
    setLoading(true);

    try {
      await callAction("createUser", toMap({ email }));
    } catch (e) {
      const error = e as ErrorWithStatus;
      if (error.status === "email_already_used") {
        setError(null);
      } else {
        setError(error.message);
        return;
      }
    } finally {
      setLoading(false);
    }

    setLoading(true);
    const response = await callAction(
      "auth.requestChallenge",
      toMap({ email })
    );
    try {
      if (response.data.type === "register") {
        webauthnRegister(response.data.challenge, loginFromKey);
      } else {
        webauthnAuthenticate(response.data.challenge, loginFromKey);
      }
    } catch (e) {
      sendLoginCode();
    }
    setError(null);
  }

  async function sendLoginCode(): Promise<void> {
    setLoading(true);
    try {
      await callAction("sendLoginCode", toMap({ email }));
      setSection("code");
    } catch (e) {
      const status = (e as ErrorWithStatus).status;
      const message = (e as ErrorWithStatus).message;
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function finishLogin(): void {
    checkLoginStatus();
  }

  function closeModal(): void {
    if (isDialogOpen()) {
      dialogRef.current?.close();
    }
  }

  function saveCurrentAuthInLocalStorage(
    email: string | null,
    authMethod: Account["authMethod"]
  ): void {
    email &&
      addInListIfNotPresent<Account>("previousAccounts", {
        email,
        authMethod,
      });
  }

  function onAccountSelected(account: Account): void {
    setEmail(account.email);
  }

  function onAccountDeleted(account: Account): void {
    removeFromList("previousAccounts", account);
    synchronizeAccounts();
  }

  async function loginFromKey(success: boolean, info: string): Promise<void> {
    if (success === false) {
      setError(info);
      sendLoginCode();
      return;
    }
    try {
      await callAction(
        "auth.submitChallengeResponse",
        toMap({ response: info })
      );
      saveCurrentAuthInLocalStorage(email, "webauthn");
      finishLogin();
    } catch (e) {
      setError((e as ErrorWithStatus).message);
    }
  }

  const handleCodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const code = e.currentTarget.code.value;

    try {
      await callAction("loginFromCode", toMap({ code, email }));
      saveCurrentAuthInLocalStorage(email, "password");
      finishLogin();
    } catch (e) {
      const message = (e as ErrorWithStatus).message;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  async function handleNameSubmit(
    e: FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    const name = e.currentTarget.playerNameInput.value;
    const isPrivateAccount = e.currentTarget.profileVisibility.checked;
    try {
      await callAction(
        "users.updateInformations",
        toMap({ name, isPrivateAccount })
      );
      finishLogin();
    } catch (e) {
      setError((e as ErrorWithStatus).message);
    }
  }

  function resetFlow() {
    setSection("email");
    setError(null);
  }

  return (
    <dialog ref={dialogRef} className="loginModal">
      {section === "email" && (
        <form aria-busy={loading} onSubmit={handleEmailSubmit}>
          <h1>Bienvenue sur Boggle</h1>
          {previousAccounts.length === 0 ? (
            <>
              <p>Avant de commencer, vous devrez vous créer un compte.</p>
              <p>
                Vous pouvez saisir votre e-mail pour que nous puissions vous en
                créer un, ou pour vous connecter à votre compte si vous en avez
                déja un.
              </p>
            </>
          ) : (
            <>
              <p>Choisir un compte</p>
              <AccountsSelector
                onAccountDeleted={onAccountDeleted}
                onAccountSelected={onAccountSelected}
                accounts={previousAccounts}
              ></AccountsSelector>
              <p>Ou utiliser une adresse différente</p>
            </>
          )}
          <label>
            <span>Adresse E-mail</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              autoFocus
            />
          </label>
          <br />
          <button>Suivant</button>
        </form>
      )}

      {section === "code" && (
        <form aria-busy={loading} onSubmit={handleCodeSubmit}>
          <h1>Valider le code</h1>
          <p>
            Nous n'avons pas réussi à vous authentifier avec passkey. Vous avez
            reçu un code par e-mail.
          </p>
          <label>
            <span>Code à usage unique</span>
            <input
              type="text"
              inputMode="numeric"
              minLength={7}
              maxLength={7}
              name="code"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              required
              autoFocus
            />
          </label>
          <br />
          <nav>
            <button type="button" className="secondary" onClick={resetFlow}>
              Annuler
            </button>
            <button>Valider</button>
          </nav>
        </form>
      )}

      {section === "name" && defaultUserName && (
        <form aria-busy={loading} onSubmit={handleNameSubmit}>
          <h1>Votre profil</h1>
          <p>
            Nous avons choisi pour vous un nom d'utilisateur, mais vous pouvez
            prendre le temps d'en choisir un autre.
          </p>
          <label>
            <span>Pseudo</span>
            <input
              id="playerNameInput"
              type="text"
              defaultValue={defaultUserName}
              pattern="[a-zA-Z0-9_-]*"
              required
              autoFocus
            />
            <small>
              Lettres majuscules et minuscules autorisées, ainsi que les
              chiffres et certains caractères spéciaux comme _ et -
            </small>
          </label>
          <label>
            <span>Compte privé</span>
            <input name="profileVisibility" type="checkbox" role="switch" />
          </label>
          <br />
          <small>
            En passant votre compte en privé, les autres joueurs ne pourront pas
            voir votre page de profil, qui référence votre historique de parties
            et les stats de victoire. En revanche, les joueurs continueront de
            voir votre nom dans les parties auxquelles vous jouez.
          </small>
          <br />
          <nav>
            <button type="button" className="secondary" onClick={closeModal}>
              Plus tard
            </button>
            <button>Valider</button>
          </nav>
        </form>
      )}

      {error && <p className="error">{error}</p>}
    </dialog>
  );
}
