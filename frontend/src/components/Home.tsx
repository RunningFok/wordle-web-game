import React, { useState } from 'react';
import { CustomGameModal } from './PopupModals';

interface HomePageProps {
  onStartSpeedGame: (wordSize: number, maxTries: number) => void;
  onStartClassicGame: (wordSize: number, maxTries: number) => void;
}

export const Home: React.FC<HomePageProps> = ({
  onStartSpeedGame,
  onStartClassicGame,
}) => {
  const [showCustomGameModal, setShowCustomGameModal] = useState(false);
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
                    setShowCustomGameModal(true);
                  }}
                >
                  Classic Mode
                </button>
              </div>
              <div className="game-card speed-card">
                <button 
                  className="game-button speed-button"
                  onClick={() => {
                    setShowCustomGameModal(true);
                    setModalMode('speed');
                  }}
                >
                  Speed Mode
                </button>
              </div>
            </div>
          </main>
          <CustomGameModal
            isOpen={showCustomGameModal}
            onClose={() => setShowCustomGameModal(false)}
            onStartSpeedGame={onStartSpeedGame}
            onStartClassicGame={onStartClassicGame}
            mode={modalMode}
          />
      </div>
    );
  };