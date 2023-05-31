import { useState } from "react";
import WithRealtime from "../components/WithRealtime";
import CreateGame from "../components/CreateGame";
import JoinGame from "../components/joinGame";
import "./Game.css";
import Navbar from "../components/Navbar";
import GamesList from "../components/GamesList";

export default function Game() {
  const [inGame, setInGame] = useState<false | string>(false);

  function whenCreated(gameId: string): void {
    setInGame(gameId);
  }

  return (
    <div className="Game">
      {inGame ? (
        <WithRealtime gameId={inGame}></WithRealtime>
      ) : (
        <div className="container padding-top">
          <Navbar></Navbar>
          <h2>Rejoindre une partie</h2>
          <GamesList whenCreated={whenCreated}></GamesList>
          <br />
          <JoinGame whenCreated={whenCreated}></JoinGame>
          <h2>Créer une partie</h2>
          <CreateGame whenCreated={whenCreated}></CreateGame>
        </div>
      )}
    </div>
  );
}
