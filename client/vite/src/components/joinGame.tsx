import { createRef } from "react";
import { GameJoinerProps } from "./CreateGame";

export default function JoinGame({ whenCreated }: GameJoinerProps) {
  const form = createRef<HTMLFormElement>();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const gameId = form.current?.gameId.value;
    whenCreated(gameId);
  }

  return (
    <div>
      <h1>Rejoindre une partie</h1>
      <form ref={form} onSubmit={handleSubmit}>
        <label>
          <input type="text" name="gameId" placeholder="ID de la partie" />
        </label>
        <button type="submit">Rejoindre la partie</button>
      </form>
    </div>
  );
}
