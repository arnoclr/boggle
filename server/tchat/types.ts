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
}

type Payload = ChatPayload;
