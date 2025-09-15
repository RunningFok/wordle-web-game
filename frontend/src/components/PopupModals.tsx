import React, { useEffect, useState } from 'react';

interface GameConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSpeedGame: (wordSize: number, maxTries: number, timeLimit: number) => void;
  onStartClassicGame: (wordSize: number, maxTries: number) => void;
  mode: 'classic' | 'speed';
}

interface InvalidWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  guessWord: string;
}

interface GameFinishModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameStatus: 'won' | 'lost' | 'timeout';
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

export const GameConfigModal: React.FC<GameConfigModalProps> = ({ 
  isOpen, 
  onClose, 
  onStartSpeedGame,
  onStartClassicGame,
  mode,
}) => {
  const [wordSize, setWordSize] = useState(5);
  const [maxTries, setMaxTries] = useState(6);
  const [timeLimit, setTimeLimit] = useState(45);

  const handleStartGame = () => {
    if (mode === 'classic') {
      onStartClassicGame(wordSize, maxTries);
    } else {
      onStartSpeedGame(wordSize, maxTries, timeLimit);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="game-config-modal">
      <div className="game-config-modal-content">
        <h2>{mode === 'classic' ? 'Classic Game Settings' : 'Speed Game Settings'}</h2>
        
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

        {mode === 'speed' && (
          <div className="setting-group">
            <h3>Time Limit</h3>
            <div className="radio-group">
              {[30, 45, 60].map(seconds => (
                <label key={seconds} className="radio-option">
                  <input
                    type="radio"
                    name="timeLimit"
                    value={seconds}
                    checked={timeLimit === seconds}
                    onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                  />
                  <span>{seconds} seconds</span>
                </label>
              ))}
            </div>
          </div>
        )}

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
        <h2>{gameStatus === 'won' ? '🎉 Congratulations!' : gameStatus === 'timeout' ? '😔 Time\'s Up!' : '😔 Game Over'}</h2>
        <p>
          {gameStatus === 'won' 
            ? `You guessed "${targetWord}" correctly!` 
            : gameStatus === 'timeout'
            ? `You ran out of time! The word was "${targetWord}"`
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