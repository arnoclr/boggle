import { useEffect, useRef, useState } from "react";
import { apiUrl } from "../vars";
import "./Grid.css";
import { PlayerColors } from "./WithRealtime";
import { Position, getAbsoluteBoundsOf } from "../utils/animations";

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
  const gridRef = useRef<HTMLDivElement>(null);

  function cellNumber(row: number, col: number) {
    return row * GRID_SIZE + col;
  }

  function cellId(cell: number) {
    return `cell-${cell}`;
  }

  function getCellImage(i: number) {
    return apiUrl + `?action=game.getCellImage&gameId=${gameId}&cell=${i}`;
  }

  function computeDefaultCellsPosition(): Position[] {
    const r: Position[] = [];
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      r.push(getAbsoluteBoundsOf(cell as HTMLDivElement));
    });
    return r;
  }

  const defaultCellsPosition = computeDefaultCellsPosition();

  function cellPositionInPath(
    cell: number,
    path: Path,
    cellSize: number
  ): Position {
    if (path.includes(cell) === false || gridRef.current === null) {
      return defaultCellsPosition[cell];
    }
    const gridBounds = getAbsoluteBoundsOf(gridRef.current);
    const PADDING = 12;
    const GAP = 8;
    const index = path.indexOf(cell);
    const y = gridBounds.y;
    const x =
      gridBounds.x +
      PADDING * 2 +
      index * GAP +
      index * cellSize +
      gridBounds.width;
    return { x, y };
  }

  function cellPosition(cell: number): Position | undefined {
    const cellElement = document.getElementById(cellId(cell));
    if (!cellElement) return defaultCellsPosition[cell];

    const cellSize = cellElement.getBoundingClientRect().width;

    if (currentPath === undefined) return defaultCellsPosition[cell];
    return cellPositionInPath(cell, currentPath, cellSize);
  }

  function cellStyle(cell: number) {
    const position = cellPosition(cell);
    if (!position) return {};
    return {
      left: `${position.x}px`,
      top: `${position.y}px`,
    };
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

  useEffect(() => {
    let timer: number;

    if (pathsToDisplay.length > 0 && currentPath === undefined) {
      setCurrentPath(pathsToDisplay[0]);
      setPathsToDisplay((prevQueue) => prevQueue.slice(1));
    } else if (currentPath !== undefined) {
      timer = setTimeout(() => {
        setCurrentPath(undefined);
      }, 800);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [currentPath, pathsToDisplay]);

  return (
    <>
      <div className="grid" ref={gridRef}>
        {[...Array(GRID_SIZE)].map((_, i) => (
          <div className="row" key={i}>
            {[...Array(GRID_SIZE)].map((_, j) => (
              <div key={j} className="cell" id={cellId(cellNumber(i, j))}>
                <img
                  width={64}
                  height={64}
                  style={cellStyle(cellNumber(i, j))}
                  src={getCellImage(cellNumber(i, j))}
                  aria-active={currentPath?.includes(cellNumber(i, j))}
                  alt=""
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
