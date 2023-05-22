import { createRef, useEffect } from "react";
import "./WordInput.css";
import { launchAnimation } from "../utils/animations";

export interface WordInputProps {
  sendRealtimeEvent: (event: string, data: any) => void;
  ws: WebSocket;
}

export function WordInput({ sendRealtimeEvent, ws }: WordInputProps) {
  const form = createRef<HTMLFormElement>();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const word = e.currentTarget.word.value;
    sendRealtimeEvent("submitWord", { word });
  }

  useEffect(() => {
    ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "wrongWord") {
        form.current?.reset();
        launchAnimation(form.current, "inputError", 300);
      } else if (data.type === "wordFound") {
        form.current?.reset();
      } else if (data.type === "waiting") {
        launchAnimation(form.current, "blink", 300, 0, 3);
      }
    });
  }, [ws, form]);

  return (
    <>
      <form className="wordInput" ref={form} onSubmit={handleSubmit}>
        <nav>
          <input
            style={{ textTransform: "uppercase" }}
            type="text"
            placeholder="Mot"
            name="word"
            pattern="[A-Za-z]{1,}"
          />
          <button>Soumettre</button>
        </nav>
      </form>
    </>
  );
}
