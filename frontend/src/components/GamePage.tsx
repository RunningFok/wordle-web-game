import React from 'react';
import { GameControl } from './GameControl';
import { GameState } from '../types/core';
import { GameBoard } from './GameBoard';
import { useGame } from '../contexts/GameContext';

interface GamePageProps {
    gameState: GameState;
    onNewGame: () => void;
    onBackToHome: () => void;
  }
  
export const GamePage: React.FC<GamePageProps> = ({
    gameState,
    onNewGame,
    onBackToHome
  }) => {
    const { timeLeft } = useGame();
    return (
      <div className="App">
        <header className="App-header">
          <div className="game-header">
            <div className="mode-indicator">
              {gameState.mode === 'classic' ? 'Classic Mode' : 'Speed Mode'}
            </div>
            {gameState.mode === 'speed' && (
              <div className="timer-display">
                <div className="timer-label">Time Left:</div>
                <div className={`timer-value ${timeLeft <= 10 ? 'timer-warning' : ''}`}>
                  {timeLeft}s
                </div>
              </div>
            )}
            <div className="game-header-buttons">
              <button className="back-button" onClick={onBackToHome}>
                Exit
              </button>
              <button className="new-game-button" onClick={onNewGame}>
                {gameState.gameStatus === 'playing' ? 'New Game' : 'Play Again'}
              </button>
            </div>
          </div>
        </header>
        <main className="game-container">
            <GameBoard
                gameState={gameState}
            />
        </main>
      </div>
    );
  };