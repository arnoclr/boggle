import { useState } from "react";
import WithRealtime from "../components/WithRealtime";
import CreateGame from "../components/CreateGame";
import JoinGame from "../components/joinGame";
import "./Game.css";
import Navbar from "../components/Navbar";

export default function Game() {
  const [inGame, setInGame] = useState<false | string>(false);

  function whenCreated(gameId: string): void {
    setInGame(gameId);
  }

  return (
    <>
      {inGame ? (
        <WithRealtime gameId={inGame}></WithRealtime>
      ) : (
        <div className="selection padding">
          <div>
            <Navbar></Navbar>
            <h1>Créer ou rejoindre une partie</h1>
            <div className="choices">
              <CreateGame whenCreated={whenCreated}></CreateGame>
              <JoinGame whenCreated={whenCreated}></JoinGame>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
