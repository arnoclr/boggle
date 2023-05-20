import { useEffect, useState } from "react";
import { apiUrl } from "../vars";
import "./Grid.css";
import { PlayerColors } from "./WithRealtime";
import { illusory } from "illusory";
import { hideElement, showElement, sleep } from "../utils/animations";

const GRID_SIZE = 4;

export interface GridProps {
  gameId: string;
  ws: WebSocket;
  colors: PlayerColors;
}

export function Grid({ gameId, ws, colors }: GridProps) {
  const [path, setPath] = useState<number[]>([]);
  const [wordColor, setWordColor] = useState<string>("");
  let closePathOverlay: number = 0;

  function cellNumber(row: number, col: number) {
    return row * GRID_SIZE + col;
  }

  function cellId(cell: number) {
    return `cell-${cell}`;
  }

  function cellPathId(cell: number) {
    return `path-${cell}`;
  }

  function getCellImage(i: number) {
    return apiUrl + `?action=game.getCellImage&gameId=${gameId}&cell=${i}`;
  }

  function drawWord(path: number[], playerName: string) {
    const INDIVIDUAL_TRANSITION_DURATION = 1500;
    const DELAY = 100;
    path.forEach((cell, i) => {
      setTimeout(async () => {
        const cellGrid = document.getElementById(cellId(cell));
        const cellPath = document.getElementById(cellPathId(cell));
        if (cellGrid && cellPath) {
          showElement(cellPath, cellGrid);
          const { finished, cancel } = illusory(cellGrid, cellPath, {
            duration: "350ms",
            easing: "cubic-bezier(.56,-0.27,.47,1.29)",
          });
          await finished;
          hideElement(cellGrid);
          await sleep(INDIVIDUAL_TRANSITION_DURATION - 350 - 250);
          showElement(cellPath, cellGrid);
          illusory(cellPath, cellGrid, {
            duration: "250ms",
            easing: "cubic-bezier(.16,.89,.47,1.29)",
          });
          hideElement(cellPath);
        }
      }, DELAY * (i + 1));
    });
    clearTimeout(closePathOverlay);
    closePathOverlay = setTimeout(() => {
      setPath([]);
    }, INDIVIDUAL_TRANSITION_DURATION + DELAY * path.length);
  }

  useEffect(() => {
    ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "wordFound") {
        const { path, displayName } = data.payload;
        setPath(path.filter((cell: number) => cell !== null));
        setWordColor(colors.get(displayName)!);
        drawWord(path, displayName);
      }
    });
  }, [ws, colors]);

  return (
    <>
      <div>
        {[...Array(GRID_SIZE)].map((_, i) => (
          <div className="row" key={i}>
            {[...Array(GRID_SIZE)].map((_, j) => (
              <div key={j} className="cell" id={cellId(cellNumber(i, j))}>
                <img src={getCellImage(cellNumber(i, j))} alt="" />
              </div>
            ))}
          </div>
        ))}
      </div>
      {path.length > 0 && (
        <div
          className="overlay"
          style={{ "--color": wordColor } as React.CSSProperties}
        >
          <div className="path">
            {path.map((cell) => (
              <div key={cell} className="cell" id={cellPathId(cell)}>
                <img width={32} height={32} src={getCellImage(cell)} alt="" />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
