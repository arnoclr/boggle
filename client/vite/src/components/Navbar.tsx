import "./Navbar.css";
import Word from "./Word";

export default function Navbar() {
  return (
    <nav className="Navbar">
      <a href="/" className="logo">
        <Word word="Boggle"></Word>
      </a>
    </nav>
  );
}
