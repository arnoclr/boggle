import { createRef, useState } from "react";
import { ErrorWithStatus, callAction, toMap } from "../utils/req";
import "./CreateGame.css";

export interface GameJoinerProps {
  whenCreated: (gameId: string) => void;
}

export default function CreateGame({ whenCreated }: GameJoinerProps) {
  const form = createRef<HTMLFormElement>();
  const [isLoading, setIsLoading] = useState(false);

  async function createGame(isPrivateGame: boolean): Promise<void> {
    setIsLoading(true);
    try {
      const response = await callAction(
        "game.createGame",
        toMap({ isPrivateGame })
      );
      const gameId = response.data.publicGameId;
      whenCreated(gameId);
    } catch (e) {
      const { message, status } = e as ErrorWithStatus;
      if (status === "already_in_game") {
        whenCreated(message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="CreateGame" aria-busy={isLoading}>
      <button className="secondary" onClick={() => createGame(false)}>
        <h3>Partie publique</h3>
        <p>
          La partie s'affichera en page d'accueil du site et d'autres joueurs
          pourront vous rejoindre.
        </p>
      </button>
      <button className="secondary" onClick={() => createGame(true)}>
        <h3>Partie privée</h3>
        <p>
          La partie ne sera pas affichée. Seules les personnes qui connaissent
          le nom de la partie pourront la rejoindre.
        </p>
      </button>
    </div>
  );
}
