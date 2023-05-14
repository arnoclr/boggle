import { useEffect, useState } from "react";
import Chat from "./Chat";
import { callAction } from "../utils/req";
import ConnectedUsers from "./ConnectedUsers";
import { Grid } from "./Grid";
import { WordInput } from "./WordInput";
import { WordsFound } from "./WordsFound";

interface Props {
  gameId: string;
}

export default function WithRealtime({ gameId }: Props) {
  const [ws, setWebSocket] = useState<WebSocket>(
    new WebSocket("ws://localhost:8082")
  );
  const [websocketToken, setWebsocketToken] = useState<string | null>(null);
  const [users, setUsers] = useState<string[]>([]);

  function tryToReconnect(): void {
    setTimeout(() => {
      console.log("try to reconnect");
      setWebSocket(new WebSocket("ws://localhost:8082"));
    }, 1000);
  }

  async function fetchWebsocketToken(): Promise<void> {
    if (websocketToken !== null) return;
    const response = await callAction("auth.getWebsocketToken", new Map());
    setWebsocketToken(response.data.token);
  }

  function sendRealtimeEvent(type: string, payload: any): void {
    console.log(websocketToken, ws.readyState);
    if (websocketToken === null) {
      // fetchWebsocketToken();
      return;
    }
    if (ws.readyState !== WebSocket.OPEN) {
      console.log("not open");
      tryToReconnect();
      return;
    }
    console.log("sending", type, payload);
    ws.send(JSON.stringify({ type, payload, token: websocketToken }));
  }

  useEffect(() => {
    sendRealtimeEvent("joinGame", { gameId });
  }, [websocketToken]);

  useEffect(() => {
    ws.onopen = () => {
      fetchWebsocketToken();
    };

    ws.onmessage = (event) => {
      console.log("message", event.data);

      const { type, payload } = JSON.parse(event.data);

      if (type === "users") {
        setUsers(payload.users.map((user: { name: string }) => user.name));
      }
    };

    ws.onclose = () => {
      console.log("disconnected");
      tryToReconnect();
    };

    ws.onerror = (error) => {
      console.log("error", error);
      tryToReconnect();
    };
  }, []);

  return (
    <>
      {websocketToken !== null &&
        ws.readyState === WebSocket.OPEN &&
        users.length > 0 && (
          <>
            <Chat sendRealtimeEvent={sendRealtimeEvent} ws={ws}></Chat>
            <Grid gameId={gameId} ws={ws}></Grid>
            <WordInput sendRealtimeEvent={sendRealtimeEvent}></WordInput>
            <WordsFound ws={ws}></WordsFound>
            <ConnectedUsers users={users}></ConnectedUsers>
          </>
        )}
    </>
  );
}
