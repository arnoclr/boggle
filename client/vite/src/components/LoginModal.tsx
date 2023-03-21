import { createRef, useEffect, useState } from "react"
import { callAction } from "../utils/req"

export default function LoginModal() {
    const [isLogin, setIsLogin] = useState<boolean>(false)

    const dialog = createRef<HTMLDialogElement>()

    const isDialogOpen = (): boolean => !!dialog.current?.open

    useEffect(() => {
        // TODO: check if user is logged in
        !isDialogOpen() && dialog.current?.showModal()
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const email = e.currentTarget.email.value
        const response = await callAction("sendLoginCode", { email })
        console.log(response)
    }

    return <dialog ref={dialog}>
        <form onSubmit={handleSubmit}>
            <label>
            <span>Adresse E-mail</span>
            <input type="email" name="email" autoComplete="email" required />
            <button>Recevoir un code !!</button>
            </label>
        </form>
    </dialog>
}