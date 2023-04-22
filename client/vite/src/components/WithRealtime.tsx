import { useEffect, useState } from "react";
import Chat from "./Chat";
import { callAction } from "../utils/req";

export default function WithRealtime() {
  const ws = new WebSocket("ws://localhost:8082");
  const [websocketToken, setWebsocketToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchWebsocketToken = async () => {
      const response = await callAction("auth.getWebsocketToken", new Map());
      setWebsocketToken(response.data.token);
    };

    fetchWebsocketToken();

    ws.onopen = () => {
      console.log("connected");
    };

    ws.onmessage = (event) => {
      console.log("message", event.data);
    };

    ws.onclose = () => {
      console.log("disconnected");
    };

    ws.onerror = (error) => {
      console.log("error", error);
    };
  }, []);

  const sendRealtimeEvent = (type: string, payload: any) => {
    if (websocketToken === null) {
      return;
    }
    console.log("sending", type, payload);
    ws.send(JSON.stringify({ type, payload, token: websocketToken }));
  };

  return (
    <>
      <small>{websocketToken}</small>
      <Chat sendRealtimeEvent={sendRealtimeEvent} ws={ws}></Chat>
    </>
  );
}
