import { useEffect, useState } from "react";
import Chat from "./Chat";
import { callAction } from "../utils/req";
import ConnectedUsers from "./ConnectedUsers";
import { Grid } from "./Grid";
import { WordInput } from "./WordInput";
import { WordsFound } from "./WordsFound";
import Timer from "./Timer";
import { wsUrl } from "../vars";
import Score from "./Score";
import "./WithRealtime.css";
import Navbar from "./Navbar";
import BlurredQR from "./BlurredQR";

export type PlayerName = string;
export type CSSColor = string;
export type PlayerColors = Map<PlayerName, CSSColor>;
export interface PlayerScore {
  name: PlayerName;
  score: number;
}

const PLAYER_COLORS: CSSColor[] = ["red", "blue", "green", "yellow"];

interface Props {
  gameId: string;
}

export default function WithRealtime({ gameId }: Props) {
  const [ws, setWebSocket] = useState<WebSocket>(new WebSocket(wsUrl));
  const [websocketToken, setWebsocketToken] = useState<string | null>(null);
  const [users, setUsers] = useState<string[]>([]);
  const [playerColors, setPlayerColors] = useState<PlayerColors>();
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [endAt, setEndAt] = useState<Date>(new Date());
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const gameUrl = window.location.href;

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
      setWebSocket(new WebSocket(wsUrl));
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
      setRemainingSeconds(Math.floor((endAt.getTime() - Date.now()) / 1000));
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
        setGameActive(true);
        setEndAt(new Date(payload.endAt));
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
                <Score
                  colors={playerColors}
                  connectedUsers={users}
                  ws={ws}
                ></Score>
                <Timer remainingSeconds={remainingSeconds}></Timer>
                <div className="gridContainer">
                  <Chat
                    sendRealtimeEvent={sendRealtimeEvent}
                    ws={ws}
                    colors={playerColors}
                  ></Chat>
                  <div className="gridContainerGrid">
                    <Grid gameId={gameId} ws={ws} colors={playerColors}></Grid>
                    {remainingSeconds > 0 && (
                      <WordInput
                        sendRealtimeEvent={sendRealtimeEvent}
                        ws={ws}
                      ></WordInput>
                    )}
                  </div>
                  <WordsFound ws={ws}></WordsFound>
                </div>
              </>
            ) : (
              <div className="padding">
                <Navbar></Navbar>
                <div className="waitingRoom">
                  <div>
                    <p>
                      Partie :{" "}
                      <span style={{ textTransform: "uppercase" }}>
                        {gameId}
                      </span>
                    </p>
                    <p>Attente d'autres joueurs ...</p>
                    <button onClick={startGame} disabled={!canStartGame()}>
                      Démarrer la partie
                    </button>
                    <BlurredQR url={gameUrl}></BlurredQR>
                  </div>
                  <ConnectedUsers
                    users={users}
                    colors={playerColors}
                  ></ConnectedUsers>
                </div>
              </div>
            )}
          </>
        )}
    </>
  );
}
