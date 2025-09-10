import React from 'react';
import { GameState } from '../types/core';

interface GameControlProps {
  gameState: GameState;
  onNewGame: () => void;
}

export const GameControl: React.FC<GameControlProps> = ({ gameState, onNewGame }) => {
  return (
    <div className="game-controls">
      <div className="game-status">
        <button onClick={onNewGame}>
          {gameState.gameStatus === 'playing' ? 'New Game' : 'Play Again'}
        </button>
      </div>
    </div>
  );
};