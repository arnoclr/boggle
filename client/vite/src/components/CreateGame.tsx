import { createRef } from "react";
import { callAction, toMap } from "../utils/req";

export interface GameJoinerProps {
  whenCreated: (gameId: string) => void;
}

export default function CreateGame({ whenCreated }: GameJoinerProps) {
  const form = createRef<HTMLFormElement>();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const isPrivateGame = form.current?.publicStatus.value === "private";
    try {
      const response = await callAction(
        "game.createGame",
        toMap({ isPrivateGame })
      );
      const gameId = response.data.publicGameId;
      whenCreated(gameId);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      <h1>Créer une partie</h1>
      <form ref={form} onSubmit={handleSubmit}>
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
        <button type="submit">Créer la partie</button>
      </form>
    </div>
  );
}
