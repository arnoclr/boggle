export interface BaseWebSocketMessage {
  type: string;
  token: string;
}

export interface ChatMessage extends BaseWebSocketMessage {
  type: "chat";
  payload: {
    message: string;
    displayName: string;
  };
}

export interface ErrorMessage extends BaseWebSocketMessage {
  type: "error";
  payload: {
    code: string;
    message: string;
  };
}

export interface JoinGameMessage extends BaseWebSocketMessage {
  type: "joinGame";
  payload: {
    gameId: string;
  };
}

export interface WordFoundMessage extends BaseWebSocketMessage {
  type: "wordFound";
  payload: {
    word: string;
    displayName: string;
    path: number[];
  };
}

export interface ConnectedUsersListMessage extends BaseWebSocketMessage {
  type: "users";
  payload: {
    users: { name: string }[];
  };
}

export interface submitWordMessage extends BaseWebSocketMessage {
  type: "submitWord";
  payload: {
    word: string;
  };
}

export interface wrongWordMessage extends BaseWebSocketMessage {
  type: "wrongWord";
  payload: null;
}

export interface startGameMessage extends BaseWebSocketMessage {
  type: "startGame";
  payload: {
    durationSeconds: number;
  };
}

export type WebSocketMessage =
  | ChatMessage
  | ErrorMessage
  | JoinGameMessage
  | WordFoundMessage
  | ConnectedUsersListMessage
  | submitWordMessage
  | wrongWordMessage
  | startGameMessage;

export interface Player {
  idPlayer: number;
  name: string;
  websocketToken: string;
}
