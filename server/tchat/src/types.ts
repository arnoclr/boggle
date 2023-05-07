export interface WebSocketMessage<T extends Payload> {
  type: T["type"];
  token: string;
  payload: T;
}

interface BasePayload {
  type: string;
}

export interface ChatPayload extends BasePayload {
  type: "chat";
  message: string;
  displayName: string;
}

export interface ErrorPayload extends BasePayload {
  type: "error";
  code: string;
  message: string;
}

export interface JoinGamePayload extends BasePayload {
  type: "joinGame";
  publicGameId: string;
}

type Payload = ChatPayload | ErrorPayload | JoinGamePayload;

export interface Player {
  idPlayer: number;
  name: string;
  websocketToken: string;
}
