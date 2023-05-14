import { createRef } from "react";

export interface WordInputProps {
  sendRealtimeEvent: (event: string, data: any) => void;
}

export function WordInput({ sendRealtimeEvent }: WordInputProps) {
  const form = createRef<HTMLFormElement>();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const word = e.currentTarget.word.value;
    sendRealtimeEvent("submitWord", { word });
    form.current?.reset();
  }

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
