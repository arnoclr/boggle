import { connection } from "./sql";
import { ChatMessage } from "./types";
import { getUserId, getGameIdFromToken } from "./game";

export async function saveMessage(message: ChatMessage, token: string): Promise<boolean> {
    try {

        const content = message.payload.message;
        const playerId = await getUserId(token);
        const gameId = await getGameIdFromToken(token);

        await connection.query(
            "INSERT INTO chat (message, idPlayer, idGame, sendAt) VALUES (?, ?, ?, ?)",
            [content, playerId, gameId, new Date()]
        );
        return true;
    } catch (e) {
        console.error("Error saving message:", e);
        return false;
    }
}

export async function deleteOldMessages(): Promise<void> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    await connection.query(
        "DELETE FROM chat WHERE sendAt < ?",
        [oneWeekAgo]
    );
}

export async function getMessages(gameId: number): Promise<ChatMessage[]> {
    try {
        const rows = await connection.query(
            "SELECT * FROM chat WHERE idGame = ? ORDER BY sendAt ASC",
            [gameId]
        );
        console.log(rows);
        const messages = rows as any;
        return messages.map((message: any) => ({
            type: "chat",
            token: "",
            payload: {
                gameId: message.idGame,
                playerId: message.idPlayer,
                content: message.message,
                displayName: "",
            }
        }));
    } catch (e) {
        console.error("Error getting messages:", e);
        return [];
    }
}