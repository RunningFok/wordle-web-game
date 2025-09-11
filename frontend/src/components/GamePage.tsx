import React from 'react';
import { GameControl } from './GameControl';
import { GameState } from '../types/core';
import { GameBoard } from './GameBoard';

interface GamePageProps {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    onNewGame: () => void;
    onBackToHome: () => void;
  }
  
export const GamePage: React.FC<GamePageProps> = ({
    gameState,
    setGameState,
    onNewGame,
    onBackToHome
  }) => {
    return (
      <div className="App">
        <header className="App-header">
          <div className="game-header">
            <button className="back-button" onClick={onBackToHome}>
              Exit
            </button>
            <div className="mode-indicator">
              {gameState.mode === 'classic' ? 'Classic Mode' : 'Custom Mode'}
            </div>
          </div>
        </header>
        <main className="game-container">
            <GameControl
                gameState={gameState}
                onNewGame={onNewGame}
            />
            <GameBoard
                gameState={gameState}
                setGameState={setGameState}
            />
        </main>
      </div>
    );
  };