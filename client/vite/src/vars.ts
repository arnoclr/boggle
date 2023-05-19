// export const apiUrl: string = "http://localhost:8081";
// export const wsUrl: string = "ws://localhost:8082";

const isTunnel: boolean = window.location.hostname.includes("arno.cl");

export const apiUrl: string = isTunnel
  ? "https://api-playboggle.arno.cl"
  : "http://localhost:8081";
export const wsUrl: string = isTunnel
  ? "wss://ws-playboggle.arno.cl"
  : "ws://localhost:8082";
