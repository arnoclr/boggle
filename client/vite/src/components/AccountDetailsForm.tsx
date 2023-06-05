
export interface AccountDetailsFormProps {
    defaultUserName: string;
    isChecked: boolean;
}

export default function AccountDetailsForm({ defaultUserName, isChecked }: AccountDetailsFormProps) {
    
    return (
        <>
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
                <input name="profileVisibility" type="checkbox" role="switch" defaultChecked={isChecked}/>
            </label>
            <br />
            <small>
                En passant votre compte en privé, les autres joueurs ne pourront pas
                voir votre page de profil, qui référence votre historique de parties
                et les stats de victoire. En revanche, les joueurs continueront de
                voir votre nom dans les parties auxquelles vous jouez.
            </small>
        </>
    )
}