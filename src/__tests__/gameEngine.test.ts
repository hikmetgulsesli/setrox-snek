/**
 * Tests for the Snake game engine
 */

import { describe, it, expect } from 'vitest';
import {
  getNextPosition,
  isOutOfBounds,
  isValidDirectionChange,
} from '../hooks/useSnakeGame';
import type { Position } from '../types';

describe('Snake Game Engine', () => {
  describe('getNextPosition', () => {
    it('should move UP correctly', () => {
      const pos: Position = { x: 5, y: 5 };
      const result = getNextPosition(pos, 'UP');
      expect(result).toEqual({ x: 5, y: 4 });
    });

    it('should move DOWN correctly', () => {
      const pos: Position = { x: 5, y: 5 };
      const result = getNextPosition(pos, 'DOWN');
      expect(result).toEqual({ x: 5, y: 6 });
    });

    it('should move LEFT correctly', () => {
      const pos: Position = { x: 5, y: 5 };
      const result = getNextPosition(pos, 'LEFT');
      expect(result).toEqual({ x: 4, y: 5 });
    });

    it('should move RIGHT correctly', () => {
      const pos: Position = { x: 5, y: 5 };
      const result = getNextPosition(pos, 'RIGHT');
      expect(result).toEqual({ x: 6, y: 5 });
    });
  });

  describe('isOutOfBounds', () => {
    const gridSize = 20;

    it('should return false for positions within bounds', () => {
      expect(isOutOfBounds({ x: 0, y: 0 }, gridSize)).toBe(false);
      expect(isOutOfBounds({ x: 10, y: 10 }, gridSize)).toBe(false);
      expect(isOutOfBounds({ x: 19, y: 19 }, gridSize)).toBe(false);
    });

    it('should return true for x < 0', () => {
      expect(isOutOfBounds({ x: -1, y: 10 }, gridSize)).toBe(true);
    });

    it('should return true for x >= gridSize', () => {
      expect(isOutOfBounds({ x: 20, y: 10 }, gridSize)).toBe(true);
      expect(isOutOfBounds({ x: 25, y: 10 }, gridSize)).toBe(true);
    });

    it('should return true for y < 0', () => {
      expect(isOutOfBounds({ x: 10, y: -1 }, gridSize)).toBe(true);
    });

    it('should return true for y >= gridSize', () => {
      expect(isOutOfBounds({ x: 10, y: 20 }, gridSize)).toBe(true);
      expect(isOutOfBounds({ x: 10, y: 25 }, gridSize)).toBe(true);
    });
  });

  describe('isValidDirectionChange', () => {
    it('should allow perpendicular direction changes', () => {
      expect(isValidDirectionChange('UP', 'LEFT')).toBe(true);
      expect(isValidDirectionChange('UP', 'RIGHT')).toBe(true);
      expect(isValidDirectionChange('DOWN', 'LEFT')).toBe(true);
      expect(isValidDirectionChange('DOWN', 'RIGHT')).toBe(true);
      expect(isValidDirectionChange('LEFT', 'UP')).toBe(true);
      expect(isValidDirectionChange('LEFT', 'DOWN')).toBe(true);
      expect(isValidDirectionChange('RIGHT', 'UP')).toBe(true);
      expect(isValidDirectionChange('RIGHT', 'DOWN')).toBe(true);
    });

    it('should block reverse direction changes', () => {
      expect(isValidDirectionChange('UP', 'DOWN')).toBe(false);
      expect(isValidDirectionChange('DOWN', 'UP')).toBe(false);
      expect(isValidDirectionChange('LEFT', 'RIGHT')).toBe(false);
      expect(isValidDirectionChange('RIGHT', 'LEFT')).toBe(false);
    });

    it('should allow same direction (no change)', () => {
      expect(isValidDirectionChange('UP', 'UP')).toBe(true);
      expect(isValidDirectionChange('DOWN', 'DOWN')).toBe(true);
      expect(isValidDirectionChange('LEFT', 'LEFT')).toBe(true);
      expect(isValidDirectionChange('RIGHT', 'RIGHT')).toBe(true);
    });
  });
});