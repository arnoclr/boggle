import { callAction } from "../utils/req";

export default function Footer() {
  async function logout() {
    try {
      await callAction("logout", new Map());
      window.location.reload();
    } catch (e: any) {
      alert("Erreur lors de la déconnexion. " + e.message || "");
    }
  }

  return (
    <footer
      style={{
        padding: "1rem",
        display: "flex",
        flexFlow: "row wrap",
        gap: "1rem",
        fontSize: "11px",
      }}
    >
      <span>
        Jeu non officiel, aucune affiliation avec Parker Brothers / Hasbro, Inc.
      </span>
      <a target="_blank" href="https://github.com/arnoclr/boggle">
        Github
      </a>
      <a href="javascript:void(0);" onClick={logout}>
        Déconnexion
      </a>
    </footer>
  );
}
