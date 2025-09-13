import React, { useState } from 'react';
import { CustomGameModal } from './PopupModals';

interface HomePageProps {
  onStartGame: (mode: 'classic' | 'custom') => void;
  onStartCustomGame: (wordSize: number, maxTries: number) => void;
}

export const Home: React.FC<HomePageProps> = ({
  onStartGame,
  onStartCustomGame,
}) => {
  const [showCustomGameModal, setShowCustomGameModal] = useState(false);
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
                  onClick={() => setShowCustomGameModal(true)}
                >
                  Custom Mode
                </button>
              </div>
            </div>
          </main>
          <CustomGameModal
            isOpen={showCustomGameModal}
            onClose={() => setShowCustomGameModal(false)}
            onStartCustomGame={onStartCustomGame}
          />
      </div>
    );
  };