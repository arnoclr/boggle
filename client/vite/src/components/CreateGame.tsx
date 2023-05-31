import { createRef, useState } from "react";
import { ErrorWithStatus, callAction, toMap } from "../utils/req";

export interface GameJoinerProps {
  whenCreated: (gameId: string) => void;
}

export default function CreateGame({ whenCreated }: GameJoinerProps) {
  const form = createRef<HTMLFormElement>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const isPrivateGame = form.current?.publicStatus.value === "private";
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
    <div>
      <p>Si vous souhaitez créer une nouvelle partie</p>
      <form aria-busy={isLoading} ref={form} onSubmit={handleSubmit}>
        <label>
          <input
            type="radio"
            name="publicStatus"
            value="public"
            defaultChecked
          />
          <span>Partie publique</span>
        </label>
        <label>
          <input type="radio" name="publicStatus" value="private" />
          <span>Partie privée</span>
        </label>
        <br />
        <button type="submit">Créer la partie</button>
      </form>
    </div>
  );
}
