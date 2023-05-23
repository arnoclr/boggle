export default function Footer() {
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
    </footer>
  );
}
