import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5500",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

httpServer.listen(8082);
