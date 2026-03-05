import React from 'react';
import { GameBoard } from './components/GameBoard';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#1a1a2e'
    }}>
      <GameBoard gridSize={20} tickRate={150} />
    </div>
  );
}

export default App;