const isTunnel: boolean = window.location.hostname !== "localhost";

export const apiUrl: string = isTunnel
  ? "https://api-playboggle.arno.cl"
  : "http://localhost:8081";
export const wsUrl: string = isTunnel
  ? "wss://ws-playboggle.arno.cl"
  : "ws://localhost:8082";
