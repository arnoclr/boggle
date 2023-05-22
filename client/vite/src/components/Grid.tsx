import { useEffect, useState } from "react";
import { apiUrl } from "../vars";
import "./Grid.css";
import { PlayerColors } from "./WithRealtime";
import { illusory } from "illusory";
import {
  clearStyles,
  hideElement,
  showElement,
  sleep,
} from "../utils/animations";

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

  async function drawWord(path: number[], playerName: string) {
    const INDIVIDUAL_TRANSITION_DURATION = 1500;
    await sleep(100);
    path.forEach((cell, i) => {
      const cellGrid = document.getElementById(cellId(cell));
      const cellPath = document.getElementById(cellPathId(cell));
      hideElement(cellPath);
      setTimeout(async () => {
        if (cellGrid && cellPath) {
          showElement(cellPath, cellGrid);
          await illusory(cellGrid, cellPath, {
            duration: "350ms",
            easing: "cubic-bezier(.14,1.17,.67,1.09)",
            compositeOnly: true,
          }).finished;
          hideElement(cellGrid);
          await sleep(INDIVIDUAL_TRANSITION_DURATION - 350 - 250);
          showElement(cellPath, cellGrid);
          await illusory(cellPath, cellGrid, {
            duration: "250ms",
            easing: "cubic-bezier(.18,-0.3,.2,1.12)",
            compositeOnly: true,
          }).finished;
          hideElement(cellPath);
          clearStyles(cellGrid);
        }
      }, 80 * (i + 1));
    });
    clearTimeout(closePathOverlay);
    closePathOverlay = setTimeout(() => {
      setPath([]);
    }, INDIVIDUAL_TRANSITION_DURATION * path.length);
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
      <div className="grid">
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
