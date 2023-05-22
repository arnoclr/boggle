import { createRef, useEffect, useState } from "react";
import "./Chat.css";

interface Props {
  sendRealtimeEvent: (event: string, data: any) => void;
  ws: WebSocket;
}

export default function Chat({ sendRealtimeEvent, ws }: Props) {
  const [messages, setMessages] = useState<
    { message: string; displayName: string; receivedAt: Date }[]
  >([]);

  const form = createRef<HTMLFormElement>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = e.currentTarget.message.value;
    sendRealtimeEvent("chat", { message });
    form.current?.reset();
  };

  useEffect(() => {
    ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat") {
        const { message, displayName } = data.payload;
        setMessages((messages) => [
          ...messages,
          { message, displayName, receivedAt: new Date() },
        ]);
      }
    });
  }, [ws]);

  return (
    <div className="chat">
      <ul>
        {messages.map((entry) => (
          <li key={+entry.receivedAt}>
            <i>{entry.displayName}</i> {entry.message}
          </li>
        ))}
      </ul>
      <br />
      <form onSubmit={handleSubmit} ref={form}>
        <nav>
          <input type="text" name="message" placeholder="Message chat" />
          <button className="secondary" type="submit">
            Envoyer
          </button>
        </nav>
      </form>
    </div>
  );
}
