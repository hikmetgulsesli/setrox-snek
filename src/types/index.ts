/**
 * Core type definitions for the Snake game
 */

/** Represents a coordinate position on the grid */
export interface Position {
  x: number;
  y: number;
}

/** Direction constants for snake movement */
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

/** Represents a single segment of the snake */
export interface SnakeSegment {
  position: Position;
  isHead: boolean;
}

/** Complete snake state */
export interface Snake {
  segments: SnakeSegment[];
  direction: Direction;
  nextDirection: Direction;
}

/** Game status states */
export type GameStatus = 'IDLE' | 'PLAYING' | 'GAME_OVER';

/** Complete game state */
export interface GameState {
  snake: Snake;
  status: GameStatus;
  gridSize: number;
  tickRate: number;
}

/** Props for the GameBoard component */
export interface GameBoardProps {
  gridSize?: number;
  tickRate?: number;
}

/** Props for individual cell rendering */
export interface CellProps {
  position: Position;
  isSnake: boolean;
  isHead: boolean;
}