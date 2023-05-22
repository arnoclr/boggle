import { createRef, useEffect, useRef, useState } from "react";
import { ErrorWithStatus, callAction, toMap } from "../utils/req";
import { webauthnRegister } from "../utils/webauthnRegister";
import { webauthnAuthenticate } from "../utils/webauthnAuthenticate";
import "./LoginModal.css";

export default function LoginModal() {
  const [needToCreateAnAccount, setNeedToCreateAnAccount] =
    useState<boolean>(false);
  const [section, setSection] = useState<"email" | "code">("email");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const isDialogOpen = (): boolean => !!dialogRef.current?.open;

  useEffect(() => {
    callAction("amIConnected", toMap({})).then((res) => {
      isDialogOpen() === false &&
        res.data.connected === false &&
        dialogRef.current?.showModal();
    });
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    }

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
  };

  async function sendLoginCode(): Promise<void> {
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
    if (isDialogOpen()) {
      dialogRef.current?.close();
    }
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
      finishLogin();
    } catch (e) {
      const message = (e as ErrorWithStatus).message;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  function resetFlow() {
    setSection("email");
    setError(null);
  }

  return (
    <dialog ref={dialogRef} className="loginModal">
      <h1>Bienvenue sur Boggle</h1>
      <p>Avant de commencer, vous devrez vous créer un compte.</p>
      <p>
        Vous pouvez saisir votre e-mail pour que nous puissions vous en créer
        un, ou pour vous connecter à votre compte si vous en avez déja un.
      </p>
      {section === "email" && (
        <form aria-busy={loading} onSubmit={handleEmailSubmit}>
          <label>
            <span>Adresse E-mail</span>
            <input
              onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              type="email"
              name="email"
              autoComplete="email"
              required
            />
          </label>
          {needToCreateAnAccount && (
            <p>
              Vous n'avez pas de compte, cliquez sur le bouton ci-dessous pour
              en créer un
            </p>
          )}
          <br />
          <button>Suivant</button>
        </form>
      )}

      {section === "code" && (
        <form aria-busy={loading} onSubmit={handleCodeSubmit}>
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
            />
          </label>
          <br />
          <nav>
            <button className="secondary" onClick={resetFlow}>
              Annuler
            </button>
            <button>Valider</button>
          </nav>
        </form>
      )}

      {error && <p className="error">{error}</p>}
    </dialog>
  );
}
