import WebSocket from "ws";

const server = new WebSocket.Server({ port: 8082 });

server.on("listening", () => {
  console.log("Le serveur WebSocket est en cours d'écoute sur le port 8082");
});
