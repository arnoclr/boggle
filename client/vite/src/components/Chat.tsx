import { createRef, useEffect, useState } from "react";
import "./Chat.css";
import { PlayerColors } from "./WithRealtime";

interface Props {
  sendRealtimeEvent: (event: string, data: any) => void;
  colors: PlayerColors;
  ws: WebSocket;
  initialMessages: { message: string; displayName: string; receivedAt: Date }[];
}

export default function Chat({ sendRealtimeEvent, ws, colors, initialMessages }: Props) {
  const [messages, setMessages] = useState<{ message: string; displayName: string; receivedAt: Date }[]>(initialMessages);

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
        setMessages((messages:any) => [
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
            <i style={{ color: colors.get(entry.displayName) }}>
              {entry.displayName}
            </i>{" "}
            {entry.message}
          </li>
        ))}
      </ul>
      <br />
      <form onSubmit={handleSubmit} ref={form}>
        <nav>
          <input
            type="text"
            name="message"
            placeholder="Message chat"
            required
          />
          <button className="secondary" type="submit">
            Envoyer
          </button>
        </nav>
      </form>
    </div>
  );
}
