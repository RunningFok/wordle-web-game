import React, { useEffect, useState } from 'react';

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