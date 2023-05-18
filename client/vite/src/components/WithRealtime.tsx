import { useEffect, useState } from "react";
import Chat from "./Chat";
import { callAction } from "../utils/req";
import ConnectedUsers from "./ConnectedUsers";
import { Grid } from "./Grid";
import { WordInput } from "./WordInput";
import { WordsFound } from "./WordsFound";
import Timer from "./Timer";

const PLAYER_COLORS = ["red", "blue", "green", "yellow"];

export type PlayerColors = Map<string, string>;

interface Props {
  gameId: string;
}

export default function WithRealtime({ gameId }: Props) {
  const [ws, setWebSocket] = useState<WebSocket>(
    new WebSocket("ws://localhost:8082")
  );
  const [websocketToken, setWebsocketToken] = useState<string | null>(null);
  const [users, setUsers] = useState<string[]>([]);
  const [playerColors, setPlayerColors] = useState<PlayerColors>();
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  function canStartGame(): boolean {
    return users.length >= 2;
  }

  function startGame(): void {
    if (!canStartGame()) return;
    sendRealtimeEvent("startGame", { durationSeconds: 0 });
  }

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
    const id = setInterval(() => {
      if (gameActive === false) return;
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [gameActive]);

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
        const users = [...payload.users];
        setUsers(users.map((user: { name: string }) => user.name));
        setPlayerColors(
          new Map(
            users.map((user: { name: string }, index: number) => [
              user.name,
              PLAYER_COLORS[index],
            ])
          )
        );
      }

      if (type === "startGame") {
        // TODO: recuperer le timer envoyé par le back et lancer le décompte
        setGameActive(true);
        setRemainingSeconds(payload.durationSeconds as number);
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
        users.length > 0 &&
        playerColors && (
          <>
            {gameActive ? (
              <>
                <Timer remainingSeconds={remainingSeconds}></Timer>
                <Chat sendRealtimeEvent={sendRealtimeEvent} ws={ws}></Chat>
                <Grid gameId={gameId} ws={ws} colors={playerColors}></Grid>
                {remainingSeconds > 0 && (
                  <WordInput
                    sendRealtimeEvent={sendRealtimeEvent}
                    ws={ws}
                  ></WordInput>
                )}
                <WordsFound ws={ws}></WordsFound>
              </>
            ) : (
              <div>
                <p>
                  Partie :{" "}
                  <span style={{ textTransform: "uppercase" }}>{gameId}</span>
                </p>
                <p>Attente d'autres joueurs ...</p>
                <button onClick={startGame} disabled={!canStartGame()}>
                  Démarrer la partie
                </button>
              </div>
            )}
            <ConnectedUsers
              users={users}
              colors={playerColors}
            ></ConnectedUsers>
          </>
        )}
    </>
  );
}
