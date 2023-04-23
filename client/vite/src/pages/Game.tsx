import { useState } from "react";
import WithRealtime from "../components/WithRealtime";
import CreateGame from "../components/CreateGame";
import JoinGame from "../components/joinGame";

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
        <>
          <CreateGame whenCreated={whenCreated}></CreateGame>
          <JoinGame whenCreated={whenCreated}></JoinGame>
        </>
      )}
    </>
  );
}
