import WebSocket from "ws";
import { WebSocketMessage } from "./types";
import { getAllTokensOfAPartyFromUserToken } from "./game";

const server = new WebSocket.Server({ port: 8082 });
const connectedUsers: Map<string, WebSocket.WebSocket> = new Map();

server.on("listening", () => {
  console.log("Listening on port 8082");
});

server.on("connection", (socket) => {
  socket.on("message", (message) => {
    console.log(connectedUsers.size);
    const { type, token, payload } = JSON.parse(
      message.toString()
    ) as WebSocketMessage<any>;
    // TODO: verify that token is the same in the database
    connectedUsers.set(token, socket);
    switch (type) {
      case "chat":
        broadcastToParty(true, token, type, payload);
    }
  });

  socket.on("close", () => {
    disconnectAllInactiveUsers();
  });
});

function broadcastToParty(
  includeSender: boolean,
  userToken: string,
  type: string,
  payload: any
) {
  const tokens = getAllTokensOfAPartyFromUserToken(userToken);
  // tokens.forEach((token) => {
  connectedUsers.forEach((socket, token) => {
    if (includeSender === false && token === userToken) {
      return;
    }
    // const socket = connectedUsers.get(token);
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
