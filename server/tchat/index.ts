import WebSocket from "ws";
import { WebSocketMessage } from "./types";
import {
  getAllTokensOfAPartyFromUserToken,
  getAllUserOfAParty,
  getUserName,
  joinGame,
  thisUserExists,
} from "./src/game";

const server = new WebSocket.Server({ port: 8082 });
const connectedUsers: Map<string, WebSocket.WebSocket> = new Map();
const connectedSockets: Map<WebSocket.WebSocket, string> = new Map();

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
    connectedSockets.set(socket, token);

    switch (type) {
      case "chat":
        await broadcastToParty(true, token, type, {
          ...payload,
          displayName: await getUserName(token),
        });
        break;
      case "joinGame":
        if (await joinGame(token, payload.gameId)) {
          sendConnectedUsersList(token);
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
    const token = connectedSockets.get(socket);
    if (token) {
      connectedUsers.delete(token);
      connectedSockets.delete(socket);
      sendConnectedUsersList(token);
    }
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

async function sendConnectedUsersList(userToken: string): Promise<void> {
  await broadcastToParty(true, userToken, "users", {
    users: (await getAllUserOfAParty(userToken))
      .filter((user) => connectedUsers.has(user.websocketToken))
      .map((user) => ({ name: user.name })),
  });
}

function disconnectAllInactiveUsers() {
  connectedUsers.forEach((socket, token) => {
    if (socket.readyState !== WebSocket.OPEN) {
      connectedUsers.delete(token);
    }
  });
}
