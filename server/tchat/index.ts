import WebSocket from "ws";
import { WebSocketMessage } from "./types";
import {
  getAllTokensOfAPartyFromUserToken,
  getUserName,
  joinGame,
  thisUserExists,
} from "./src/game";

const server = new WebSocket.Server({ port: 8082 });
const connectedUsers: Map<string, WebSocket.WebSocket> = new Map();

server.on("listening", () => {
  console.log("Listening on port 8082");
});

server.on("connection", (socket) => {
  socket.on("message", async (message) => {
    console.log(connectedUsers.size);
    const { type, token, payload } = JSON.parse(
      message.toString()
    ) as WebSocketMessage<any>;
    if ((await thisUserExists(token)) === false) {
      socket.close();
      return;
    }
    connectedUsers.set(token, socket);
    switch (type) {
      case "chat":
        await broadcastToParty(true, token, type, {
          ...payload,
          displayName: await getUserName(token),
        });
        break;
      case "joinGame":
        if (await joinGame(token, payload.gameId)) {
          await broadcastToParty(true, token, type, {
            users: [],
          });
        } else {
          connectedUsers.get(token)?.send(
            JSON.stringify({
              type: "error",
              payload: {
                code: "joinGameFailed",
                message: "Impossible de rejoindre la partie",
              },
            })
          );
        }
        break;
      default:
        break;
    }
  });

  socket.on("close", () => {
    disconnectAllInactiveUsers();
  });
});

async function broadcastToParty(
  includeSender: boolean,
  userToken: string,
  type: string,
  payload: any
) {
  const tokens = await getAllTokensOfAPartyFromUserToken(userToken);
  tokens.forEach((token) => {
    if (includeSender === false && token === userToken) {
      return;
    }
    const socket = connectedUsers.get(token);
    if (socket) {
      socket.send(JSON.stringify({ type, payload }));
    }
  });
}

function disconnectAllInactiveUsers() {
  connectedUsers.forEach((socket, token) => {
    if (socket.readyState !== WebSocket.OPEN) {
      connectedUsers.delete(token);
    }
  });
}
