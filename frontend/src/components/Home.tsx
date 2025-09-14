import React, { useState } from 'react';
import { GameConfigModal } from './PopupModals';

interface HomePageProps {
  onStartSpeedGame: (wordSize: number, maxTries: number, timeLimit: number) => void;
  onStartClassicGame: (wordSize: number, maxTries: number) => void;
}

export const Home: React.FC<HomePageProps> = ({
  onStartSpeedGame,
  onStartClassicGame,
}) => {
  const [showGameConfigModal, setShowGameConfigModal] = useState(false);
  const [modalMode, setModalMode] = useState<'classic' | 'speed'>('classic');
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
                  onClick={() => {
                    setModalMode('classic');
                    setShowGameConfigModal(true);
                  }}
                >
                  Classic Mode
                </button>
              </div>
              <div className="game-card speed-card">
                <button 
                  className="game-button speed-button"
                  onClick={() => {
                    setModalMode('speed');
                    setShowGameConfigModal(true);
                  }}
                >
                  Speed Mode
                </button>
              </div>
            </div>
          </main>
          <GameConfigModal
            isOpen={showGameConfigModal}
            onClose={() => setShowGameConfigModal(false)}
            onStartSpeedGame={onStartSpeedGame}
            onStartClassicGame={onStartClassicGame}
            mode={modalMode}
          />
      </div>
    );
  };