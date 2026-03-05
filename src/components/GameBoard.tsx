/**
 * GameBoard component - renders the 20x20 grid and snake
 */

import React from 'react';
import type { Position } from '../types';
import { useSnakeGame } from '../hooks/useSnakeGame';
import './GameBoard.css';

interface GameBoardProps {
  gridSize?: number;
  tickRate?: number;
}

const DEFAULT_GRID_SIZE = 20;
const DEFAULT_TICK_RATE = 150;

/**
 * Check if a position matches any snake segment
 */
const getSnakeSegmentAt = (
  position: Position,
  segments: { position: Position; isHead: boolean }[]
): { isSnake: boolean; isHead: boolean } => {
  for (const segment of segments) {
    if (segment.position.x === position.x && segment.position.y === position.y) {
      return { isSnake: true, isHead: segment.isHead };
    }
  }
  return { isSnake: false, isHead: false };
};

/**
 * Get CSS class for snake segment direction based on neighbors
 */
const getSegmentClass = (
  position: Position,
  segments: { position: Position; isHead: boolean }[]
): string => {
  const segmentIndex = segments.findIndex(
    (s) => s.position.x === position.x && s.position.y === position.y
  );

  if (segmentIndex === -1) return '';

  const current = segments[segmentIndex];
  const prev = segments[segmentIndex - 1];
  const next = segments[segmentIndex + 1];

  if (current.isHead && prev) {
    // Determine head rotation based on neck position
    const dx = current.position.x - prev.position.x;
    const dy = current.position.y - prev.position.y;
    if (dx === 1) return 'snake-head snake-head-right';
    if (dx === -1) return 'snake-head snake-head-left';
    if (dy === 1) return 'snake-head snake-head-down';
    if (dy === -1) return 'snake-head snake-head-up';
  }

  return 'snake-body';
};

export const GameBoard: React.FC<GameBoardProps> = ({
  gridSize = DEFAULT_GRID_SIZE,
  tickRate = DEFAULT_TICK_RATE,
}) => {
  const { snake, status, startGame, resetGame } = useSnakeGame(gridSize, tickRate);

  // Generate grid cells
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const position: Position = { x, y };
      const { isSnake, isHead } = getSnakeSegmentAt(position, snake.segments);
      const segmentClass = isSnake ? getSegmentClass(position, snake.segments) : '';

      cells.push(
        <div
          key={`${x}-${y}`}
          className={`cell ${isSnake ? segmentClass : ''}`}
          data-x={x}
          data-y={y}
        >
          {isHead && (
            <>
              <div className="eye eye-left" />
              <div className="eye eye-right" />
            </>
          )}
        </div>
      );
    }
  }

  return (
    <div className="game-container">
      <div className="game-status">
        {status === 'IDLE' && <p>Press SPACE or click Start to begin</p>}
        {status === 'PLAYING' && <p>Game Running - Use arrow keys or WASD</p>}
        {status === 'GAME_OVER' && <p className="game-over">Game Over!</p>}
      </div>

      <div
        className="game-board"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {cells}
      </div>

      <div className="game-controls">
        {status === 'IDLE' && (
          <button onClick={startGame} className="btn btn-primary">
            Start Game
          </button>
        )}
        {status === 'PLAYING' && (
          <button onClick={resetGame} className="btn btn-secondary">
            Reset
          </button>
        )}
        {status === 'GAME_OVER' && (
          <button onClick={resetGame} className="btn btn-primary">
            Play Again
          </button>
        )}
      </div>
    </div>
  );
};