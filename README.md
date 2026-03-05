# Setrox Snek

A classic Snake game built with React, TypeScript, and Vite.

## Features

- **20x20 Grid**: Classic arcade-style game board
- **Smooth Movement**: Configurable tick rate using requestAnimationFrame
- **Keyboard Controls**: Arrow keys or WASD for direction
- **Visual Polish**: Snake head with animated eyes, rounded segments
- **Game States**: Idle, Playing, and Game Over states
- **Boundary Detection**: Game ends when snake hits walls

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Type check
npm run typecheck
```

## Controls

- **Arrow Keys / WASD**: Change direction
- **Space**: Start game

## Architecture

- **GameBoard**: Main component rendering the grid
- **useSnakeGame**: Custom hook managing game state and loop
- **TypeScript**: Fully typed game state and interfaces

## Game Logic

- Snake moves continuously in current direction
- Direction changes are queued for next tick
- Boundary collision triggers game over
- Snake body is stored as array of coordinates
- Head segment has special rendering with eyes