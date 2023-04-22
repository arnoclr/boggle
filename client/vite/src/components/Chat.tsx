import { createRef, useEffect, useState } from "react";

interface Props {
  sendRealtimeEvent: (event: string, data: any) => void;
  ws: WebSocket;
}

export default function Chat({ sendRealtimeEvent, ws }: Props) {
  const [messages, setMessages] = useState<string[]>([]);

  const form = createRef<HTMLFormElement>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = e.currentTarget.message.value;
    sendRealtimeEvent("chat", { message });
    form.current?.reset();
  };

  useEffect(() => {
    // ws.addEventListener("message", (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === "chat") {
    //     setMessages((messages) => [...messages, data.payload.message]);
    //   }
    // });
  }, []);

  return (
    <>
      <ul>
        {messages.map((message) => (
          <li>{message}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} ref={form}>
        <input type="text" name="message" />
        <button type="submit">Envoyer</button>
      </form>
    </>
  );
}
