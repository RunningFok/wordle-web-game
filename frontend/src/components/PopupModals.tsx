import React, { useEffect, useState } from 'react';

interface CustomGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCustomGame: (wordSize: number, maxTries: number) => void;
}

interface InvalidWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  guessWord: string;
}

interface GameFinishModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameStatus: 'won' | 'lost';
  targetWord: string;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export const InvalidWordModal: React.FC<InvalidWordModalProps> = ({ 
  isOpen, 
  onClose, 
  guessWord,
}) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      setShouldRender(false);
    }
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (isOpen) {
      setShouldRender(false);
      onClose();
    }
  };

  if (!shouldRender) return null;

  return (
    <div 
      className="invalid-word-modal auto-close"
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="invalid-word-modal-content">
        <p>{guessWord} is not a valid word in our word list!</p>
      </div>
    </div>
  );
};

export const CustomGameModal: React.FC<CustomGameModalProps> = ({ 
  isOpen, 
  onClose, 
  onStartCustomGame,
}) => {
  const [wordSize, setWordSize] = useState(5);
  const [maxTries, setMaxTries] = useState(6);

  const handleStartGame = () => {
    onStartCustomGame(wordSize, maxTries);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="custom-game-modal">
      <div className="custom-game-modal-content">
        <h2>Custom Game Settings</h2>
        
        <div className="setting-group">
          <h3>Word Size</h3>
          <div className="radio-group">
            {[4, 5, 6].map(size => (
              <label key={size} className="radio-option">
                <input
                  type="radio"
                  name="wordSize"
                  value={size}
                  checked={wordSize === size}
                  onChange={(e) => setWordSize(parseInt(e.target.value))}
                />
                <span>{size} letters</span>
              </label>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <h3>Max Tries</h3>
          <div className="radio-group">
            {[5, 6, 7].map(tries => (
              <label key={tries} className="radio-option">
                <input
                  type="radio"
                  name="maxTries"
                  value={tries}
                  checked={maxTries === tries}
                  onChange={(e) => setMaxTries(parseInt(e.target.value))}
                />
                <span>{tries} tries</span>
              </label>
            ))}
          </div>
        </div>

        <div className="modal-buttons">
          <button 
            className="modal-button cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="modal-button start-button"
            onClick={handleStartGame}
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export const GameFinishModal: React.FC<GameFinishModalProps> = ({ 
  isOpen, 
  onClose, 
  gameStatus,
  targetWord,
  onPlayAgain,
  onBackToHome,
}) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      setShouldRender(false);
    }
  }, [isOpen]);

  const handlePlayAgain = () => {
    onPlayAgain();
    setShouldRender(false);
    onClose();
  };

  if (!shouldRender) return null;

  return (
    <div className="game-finish-modal">
      <div className="game-finish-modal-content">
        <h2>{gameStatus === 'won' ? '🎉 Congratulations!' : '😔 Game Over'}</h2>
        <p>
          {gameStatus === 'won' 
            ? `You guessed "${targetWord}" correctly!` 
            : `The word was "${targetWord}"`
          }
        </p>
        <button 
          className="game-finish-modal-button play-again-button"
          onClick={handlePlayAgain}
        >
          Play Again
        </button>
        <button 
          className="game-finish-modal-button back-to-home-button"
          onClick={onBackToHome}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};