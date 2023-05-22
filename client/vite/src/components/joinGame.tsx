import { createRef, useState } from "react";
import { GameJoinerProps } from "./CreateGame";

export default function JoinGame({ whenCreated }: GameJoinerProps) {
  const form = createRef<HTMLFormElement>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const gameId = form.current?.gameId.value;
    whenCreated(gameId);
  }

  return (
    <div>
      <p>Si vous avez un code envoyé par quelqu'un</p>
      <form ref={form} onSubmit={handleSubmit}>
        <label>
          <span>Identifiant de partie</span>
          <input
            type="text"
            name="gameId"
            placeholder="AKRIP"
            autoComplete="off"
            spellCheck={false}
            autoCapitalize="characters"
            style={{ textTransform: "uppercase" }}
          />
        </label>
        <br />
        <button type="submit">Rejoindre la partie</button>
      </form>
    </div>
  );
}
