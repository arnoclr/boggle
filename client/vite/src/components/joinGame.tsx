import { createRef, useState } from "react";
import { GameJoinerProps } from "./CreateGame";
import "./joinGame.css";

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
    <div className="joinGame">
      <form ref={form} aria-busy={isLoading} onSubmit={handleSubmit}>
        <label>
          <span>Je connais le code</span>
          <input
            type="text"
            name="gameId"
            placeholder="AKRIP"
            autoComplete="off"
            spellCheck={false}
            autoCapitalize="characters"
            style={{ textTransform: "uppercase" }}
            minLength={5}
            maxLength={5}
            required
          />
        </label>
        <button className="tertiary" type="submit">
          Rejoindre la partie
        </button>
      </form>
    </div>
  );
}
