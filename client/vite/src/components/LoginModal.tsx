import { createRef, useEffect, useState } from "react"
import { callAction, ErrorWithStatus, toMap } from "../utils/req"

export default function LoginModal() {
    const [isLogin, setIsLogin] = useState<boolean>(false)
    const [needToCreateAnAccount, setNeedToCreateAnAccount] = useState<boolean>(false)

    const dialog = createRef<HTMLDialogElement>()

    const isDialogOpen = (): boolean => !!dialog.current?.open

    useEffect(() => {
        // TODO: check if user is logged in
        !isDialogOpen() && dialog.current?.showModal()
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const email = e.currentTarget.email.value
        try {
            const response = await callAction("sendLoginCode", toMap({ email }))
        } catch(e) {
            const status = (e as ErrorWithStatus).status
            if (status === "email_not_found") {
                setNeedToCreateAnAccount(true)
            }
        }
    }

    return <dialog ref={dialog}>
        <form onSubmit={handleSubmit}>
            <label>
                <span>Adresse E-mail</span>
                <input type="email" name="email" autoComplete="email" required />
            </label>
            {needToCreateAnAccount && <p>Vous n'avez pas de compte, cliquez sur le bouton ci-dessous pour en créer un</p>}
            <button>Recevoir un code !!</button>
        </form>
    </dialog>
}