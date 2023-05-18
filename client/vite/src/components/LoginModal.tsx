import { createRef, useEffect, useState } from "react";
import { ErrorWithStatus, callAction, toMap } from "../utils/req";
import { webauthnRegister } from "../utils/webauthnRegister";
import { webauthnAuthenticate } from "../utils/webauthnAuthenticate";

export default function LoginModal() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [needToCreateAnAccount, setNeedToCreateAnAccount] =
    useState<boolean>(false);
  const [section, setSection] = useState<"email" | "code">("email");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const dialog = createRef<HTMLDialogElement>();

  const isDialogOpen = (): boolean => !!dialog.current?.open;

  useEffect(() => {
    callAction("amIConnected", toMap({})).then((res) => {
      isDialogOpen() === false &&
        res.data.connected === false &&
        dialog.current?.showModal();
    });
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (needToCreateAnAccount) {
      try {
        await callAction("createUser", toMap({ email }));
      } catch (e) {
        const error = e as ErrorWithStatus;
        if (error.status === "email_already_used") {
          setNeedToCreateAnAccount(false);
        } else {
          setError(error.message);
          return;
        }
      }
    }

    try {
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
        await callAction("sendLoginCode", toMap({ email }));
        setSection("code");
      }
      setError(null);
    } catch (e) {
      const status = (e as ErrorWithStatus).status;
      if (status === "email_not_found") {
        setNeedToCreateAnAccount(true);
        setError(null);
      } else {
        const message = (e as ErrorWithStatus).message;
        setError(message);
      }
    }
  };

  function finishLogin(): void {
    setIsLogin(true);
    if (isDialogOpen()) {
      dialog.current?.close();
    }
  }

  async function loginFromKey(success: boolean, info: string): Promise<void> {
    if (success === false) {
      setError(info);
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
    const code = e.currentTarget.code.value;

    try {
      await callAction("loginFromCode", toMap({ code, email }));
      finishLogin();
    } catch (e) {
      const message = (e as ErrorWithStatus).message;
      setError(message);
    }
  };

  return (
    <dialog ref={dialog}>
      {section === "email" && (
        <form onSubmit={handleEmailSubmit}>
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
        <form onSubmit={handleCodeSubmit}>
          <button onClick={() => setSection("email")}>
            Changer d'adresse E-mail
          </button>
          <br />
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
          <button>Valider</button>
        </form>
      )}

      {error && <p>{error}</p>}
    </dialog>
  );
}
