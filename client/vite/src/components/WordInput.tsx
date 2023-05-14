import { createRef, useEffect } from "react";
import "./WordInput.css";

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
    form.current?.reset();
  }

  useEffect(() => {
    ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "wrongWord") {
        form.current?.classList.add("wrong");
        setTimeout(() => {
          form.current?.classList.remove("wrong");
        }, 300);
      }
    });
  }, [ws]);

  return (
    <>
      <form ref={form} onSubmit={handleSubmit}>
        <input
          style={{ textTransform: "uppercase" }}
          type="text"
          placeholder="Mot"
          name="word"
          pattern="[A-Za-z]{1,}"
        />
        <button>Soumettre</button>
      </form>
    </>
  );
}
