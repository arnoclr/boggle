import { createRef, useEffect, useState } from "react"
import { callAction, ErrorWithStatus, toMap } from "../utils/req"

export default function LoginModal() {
    const [isLogin, setIsLogin] = useState<boolean>(false)
    const [needToCreateAnAccount, setNeedToCreateAnAccount] = useState<boolean>(false)
    const [section, setSection] = useState<"email" | "code">("email")
    const [error, setError] = useState<string | null>(null)
    const [email, setEmail] = useState<string | null>(null)

    const dialog = createRef<HTMLDialogElement>()

    const isDialogOpen = (): boolean => !!dialog.current?.open

    callAction("amIConnected", toMap({})).then((res) => {
        isDialogOpen() === false && res.data.connected === false && dialog.current?.showModal()
    })

    const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (needToCreateAnAccount) {
            await callAction("createUser", toMap({ email }))
        }

        try {
            console.log("sending code")
            await callAction("sendLoginCode", toMap({ email }))
            setSection("code")
            setError(null)
        } catch(e) {
            const status = (e as ErrorWithStatus).status
            if (status === "email_not_found") {
                setNeedToCreateAnAccount(true)
                setError(null)
            } else {
                const message = (e as ErrorWithStatus).message
                setError(message)
            }
        }
    }

    const handleCodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const code = e.currentTarget.code.value

        try {
            await callAction("loginFromCode", toMap({ code, email }))
            setIsLogin(true)
            if (isDialogOpen()) {
                dialog.current?.close()
            }
        } catch(e) {
            const message = (e as ErrorWithStatus).message
            setError(message)
        }
    }

    return <dialog ref={dialog}>
        {section === "email" && <form onSubmit={handleEmailSubmit}>
            <label>
                <span>Adresse E-mail</span>
                <input onInput={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} type="email" name="email" autoComplete="email" required />
            </label>
            {needToCreateAnAccount && <p>Vous n'avez pas de compte, cliquez sur le bouton ci-dessous pour en créer un</p>}
            <button>Suivant</button>
        </form>}

        {section === "code" && <form onSubmit={handleCodeSubmit}>
            <label>
                <span>Code à usage unique</span>
                <input type="text" inputMode="numeric" minLength={7} maxLength={7} name="code" autoComplete="one-time-code" pattern="[0-9]*" required />
            </label>
            <button>Valider</button>
        </form>}

        {error && <p>{error}</p>}
    </dialog>
}