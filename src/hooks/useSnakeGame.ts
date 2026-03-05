/**
 * Game engine hook - manages snake state, movement, and game loop
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Position, Direction, Snake, GameState, GameStatus } from '../types';

const DEFAULT_GRID_SIZE = 20;
const DEFAULT_TICK_RATE = 150; // milliseconds

const INITIAL_SNAKE: Snake = {
  segments: [
    { position: { x: 10, y: 10 }, isHead: true },
    { position: { x: 9, y: 10 }, isHead: false },
    { position: { x: 8, y: 10 }, isHead: false },
  ],
  direction: 'RIGHT',
  nextDirection: 'RIGHT',
};

const getInitialState = (gridSize: number, tickRate: number): GameState => ({
  snake: INITIAL_SNAKE,
  status: 'IDLE',
  gridSize,
  tickRate,
});

/**
 * Calculate the next position based on current position and direction
 */
export const getNextPosition = (position: Position, direction: Direction): Position => {
  switch (direction) {
    case 'UP':
      return { x: position.x, y: position.y - 1 };
    case 'DOWN':
      return { x: position.x, y: position.y + 1 };
    case 'LEFT':
      return { x: position.x - 1, y: position.y };
    case 'RIGHT':
      return { x: position.x + 1, y: position.y };
    default:
      return position;
  }
};

/**
 * Check if position is outside grid boundaries
 */
export const isOutOfBounds = (position: Position, gridSize: number): boolean => {
  return position.x < 0 || position.x >= gridSize || position.y < 0 || position.y >= gridSize;
};

/**
 * Check if direction change is valid (can't reverse directly)
 */
export const isValidDirectionChange = (current: Direction, next: Direction): boolean => {
  const opposites: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  };
  return opposites[current] !== next;
};

/**
 * Custom hook for managing snake game state
 */
export const useSnakeGame = (gridSize: number = DEFAULT_GRID_SIZE, tickRate: number = DEFAULT_TICK_RATE) => {
  const [gameState, setGameState] = useState<GameState>(() => getInitialState(gridSize, tickRate));
  const requestRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  /**
   * Start the game
   */
  const startGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, status: 'PLAYING' }));
  }, []);

  /**
   * Reset the game to initial state
   */
  const resetGame = useCallback(() => {
    setGameState(getInitialState(gridSize, tickRate));
  }, [gridSize, tickRate]);

  /**
   * Set the next direction (queued for next tick)
   */
  const setDirection = useCallback((direction: Direction) => {
    setGameState((prev) => {
      if (prev.status !== 'PLAYING') return prev;
      if (!isValidDirectionChange(prev.snake.direction, direction)) return prev;
      return {
        ...prev,
        snake: { ...prev.snake, nextDirection: direction },
      };
    });
  }, []);

  /**
   * Update snake position for one tick
   */
  const updateSnake = useCallback(() => {
    setGameState((prev) => {
      if (prev.status !== 'PLAYING') return prev;

      const { snake } = prev;
      const newDirection = snake.nextDirection;
      const head = snake.segments[0];
      const newHeadPosition = getNextPosition(head.position, newDirection);

      // Check boundary collision
      if (isOutOfBounds(newHeadPosition, prev.gridSize)) {
        return { ...prev, status: 'GAME_OVER' };
      }

      // Create new head segment
      const newHead: typeof head = {
        position: newHeadPosition,
        isHead: true,
      };

      // Update body: shift positions, remove tail
      const newSegments = [
        newHead,
        ...snake.segments.slice(0, -1).map((seg) => ({ ...seg, isHead: false })),
      ];

      return {
        ...prev,
        snake: {
          segments: newSegments,
          direction: newDirection,
          nextDirection: newDirection,
        },
      };
    });
  }, []);

  /**
   * Game loop using requestAnimationFrame
   */
  const gameLoop = useCallback(
    (timestamp: number) => {
      if (gameState.status === 'PLAYING') {
        const elapsed = timestamp - lastTickRef.current;
        if (elapsed >= gameState.tickRate) {
          updateSnake();
          lastTickRef.current = timestamp;
        }
      }
      requestRef.current = requestAnimationFrame(gameLoop);
    },
    [gameState.status, gameState.tickRate, updateSnake]
  );

  // Start/stop the game loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameLoop]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          setDirection('RIGHT');
          break;
        case ' ':
          e.preventDefault();
          if (gameState.status === 'IDLE' || gameState.status === 'GAME_OVER') {
            startGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setDirection, startGame, gameState.status]);

  return {
    ...gameState,
    startGame,
    resetGame,
    setDirection,
  };
};