import { useEffect, useState } from "react";
import { apiUrl } from "../vars";
import "./Grid.css";
import { PlayerColors } from "./WithRealtime";

const GRID_SIZE = 4;

export interface GridProps {
  gameId: string;
  ws: WebSocket;
  colors: PlayerColors;
}

export type Cell = number;
export type Path = Cell[];

export function Grid({ gameId, ws, colors }: GridProps) {
  const [pathsToDisplay, setPathsToDisplay] = useState<Path[]>([]);
  const [currentPath, setCurrentPath] = useState<Path>();

  function cellNumber(row: number, col: number) {
    return row * GRID_SIZE + col;
  }

  function cellId(cell: number) {
    return `cell-${cell}`;
  }

  function getCellImage(i: number) {
    return apiUrl + `?action=game.getCellImage&gameId=${gameId}&cell=${i}`;
  }

  useEffect(() => {
    ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "wordFound") {
        const { path, displayName } = data.payload;
        setPathsToDisplay((paths) => [...paths, path]);
      }
    });
  }, [ws, colors]);

  function isSamePath(path1: Path | undefined, path2: Path | undefined) {
    if (!path1 || !path2) return false;
    return path1.toString() === path2.toString();
  }

  useEffect(() => {
    let timer: number;

    if (pathsToDisplay.length > 0 && isSamePath(currentPath, [])) {
      setCurrentPath(pathsToDisplay[0]);
      setPathsToDisplay((prevQueue) => prevQueue.slice(1));
    } else if (!isSamePath(currentPath, [])) {
      timer = setTimeout(() => {
        setCurrentPath([]);
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [currentPath, pathsToDisplay]);

  return (
    <>
      <div className="grid">
        {[...Array(GRID_SIZE)].map((_, i) => (
          <div className="row" key={i}>
            {[...Array(GRID_SIZE)].map((_, j) => (
              <div
                key={j}
                className="cell"
                id={cellId(cellNumber(i, j))}
                aria-active={currentPath?.includes(cellNumber(i, j))}
              >
                <img src={getCellImage(cellNumber(i, j))} alt="" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
