import { useNavigate } from "react-router-dom";
import CreateGame from "../components/CreateGame";
import GamesList from "../components/GamesList";
import Navbar from "../components/Navbar";
import JoinGame from "../components/joinGame";

export default function Home() {
  const navigate = useNavigate();

  function whenCreated(gameId: string): void {
    navigate(`/g/${gameId}`);
  }

  return (
    <div className="container padding-top">
      <Navbar></Navbar>
      <h2>Rejoindre une partie</h2>
      <GamesList whenCreated={whenCreated}></GamesList>
      <br />
      <JoinGame whenCreated={whenCreated}></JoinGame>
      <h2>Créer une partie</h2>
      <CreateGame whenCreated={whenCreated}></CreateGame>
    </div>
  );
}
