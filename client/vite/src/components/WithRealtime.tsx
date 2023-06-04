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

export type PlayerName = string;
export type CSSColor = string;
export type PlayerColors = Map<PlayerName, CSSColor>;
export interface PlayerScore {
  name: PlayerName;
  score: number;
}

const PLAYER_COLORS: CSSColor[] = ["#E40027", "#E88823", "#264BCC", "#2AA146"];

const DURATIONS: { label: string; value: number }[] = [
  { label: "Partie rapide", value: 100 },
  { label: "Partie normale", value: 180 },
  { label: "Partie longue", value: 300 },
];

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
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [iAmGameOwner, setIAmGameOwner] = useState<boolean>(false);

  function canStartGame(): boolean {
    return users.length >= 2 && iAmGameOwner;
  }

  function startGame(): void {
    if (!canStartGame()) return;
    sendRealtimeEvent("startGame", { durationSeconds });
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

  function secondsToMinutes(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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
        setIAmGameOwner(payload.gameOwnerToken === websocketToken);
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
  }, [websocketToken]);

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
                <div className="gridContainer padding-top">
                  <Chat
                    sendRealtimeEvent={sendRealtimeEvent}
                    ws={ws}
                    colors={playerColors}
                  ></Chat>
                  <div className="gridContainerGrid">
                    <Grid gameId={gameId} ws={ws} colors={playerColors}></Grid>
                    {remainingSeconds > 0 && (
                      <div role="group" style={{ width: "356px" }}>
                        <WordInput
                          sendRealtimeEvent={sendRealtimeEvent}
                          ws={ws}
                        ></WordInput>
                        <Timer remainingSeconds={remainingSeconds}></Timer>
                      </div>
                    )}
                  </div>
                  <WordsFound ws={ws}></WordsFound>
                </div>
              </>
            ) : (
              <div className="container">
                <Navbar></Navbar>
                <div className="waitingRoom" style={{ marginTop: "1rem" }}>
                  <div>
                    <p>
                      Partie :&nbsp;
                      <span style={{ textTransform: "uppercase" }}>
                        {gameId}
                      </span>
                    </p>
                    {!canStartGame() && <p>Attente d'autres joueurs ...</p>}
                    <select
                      onChange={(event) =>
                        setDurationSeconds(parseInt(event.target.value))
                      }
                    >
                      {DURATIONS.map((duration) => (
                        <option key={duration.value} value={duration.value}>
                          {duration.label} ({secondsToMinutes(duration.value)})
                        </option>
                      ))}
                    </select>
                    <button
                      className="big"
                      onClick={startGame}
                      disabled={!canStartGame()}
                    >
                      Démarrer la partie
                    </button>
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
