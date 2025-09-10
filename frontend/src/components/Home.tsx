import React from 'react';

interface HomePageProps {
  onStartGame: (mode: 'classic' | 'custom') => void;
}

export const Home: React.FC<HomePageProps> = ({
  onStartGame,
}) => {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-title">Wordle!</div>
        </header>
        <main className="homepage-container">
            <div className="game-cards">
              <div className="game-card classic-card">
                <button 
                  className="game-button classic-button"
                  onClick={() => onStartGame('classic')}
                >
                  Classic Mode
                </button>
              </div>
              <div className="game-card custom-card">
                <button 
                  className="game-button custom-button"
                  onClick={() => onStartGame('custom')}
                >
                  Custom Mode
                </button>
              </div>
            </div>
          </main>
      </div>
    );
  };