import { useEffect, useState } from "react";

export interface WordsFoundProps {
  ws: WebSocket;
}

export function WordsFound({ ws }: WordsFoundProps) {
  const [wordsFound, setWordsFound] = useState<string[]>([]);

  useEffect(() => {
    ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "wordFound") {
        const { word, displayName } = data.payload;
        setWordsFound((wordsFound) => [...wordsFound, word]);
      }
    });
  }, [ws]);

  return (
    <>
      <ul>
        {wordsFound.map((word) => (
          <li key={word}>{word}</li>
        ))}
      </ul>
    </>
  );
}
