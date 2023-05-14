import { createRef, useEffect, useState } from "react";

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
    <>
      <ul>
        {messages.map((entry) => (
          <li key={+entry.receivedAt}>
            <i>{entry.displayName}</i> {entry.message}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} ref={form}>
        <input type="text" name="message" placeholder="Message chat" />
        <button type="submit">Envoyer</button>
      </form>
    </>
  );
}
