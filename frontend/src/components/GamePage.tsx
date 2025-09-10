import React from 'react';

interface GamePageProps {

    selectedMode: 'classic' | 'custom';
    onNewGame: () => void;
    onBackToHome: () => void;
  }
  
export const GamePage: React.FC<GamePageProps> = ({
    selectedMode,
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
              {selectedMode === 'classic' ? 'Classic Mode' : 'Custom Mode'}
            </div>
          </div>
        </header>
      </div>
    );
  };