import React from 'react';
import { GameState } from '../types/core';

interface GameKeyboardProps {
  gameState: GameState;
  onKeyPress: (key: string) => void;
}

export const GameKeyboard: React.FC<GameKeyboardProps> = ({ gameState, onKeyPress }) => {
    const keyboardRows = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
    ];

    const getKeyStatus = (letter: string): 'correct' | 'incorrect-position' | 'incorrect' | 'unused' => {
        let bestStatus: 'correct' | 'incorrect-position' | 'incorrect' | 'unused' = 'unused';
        for (const guess of gameState.tries) {
          for (const result of guess.letterResults) {
            if (result.letter === letter) {
              if (result.status === 'correct') {
                bestStatus = 'correct';
                break;
              } else if (result.status === 'incorrect-position' && bestStatus === 'unused') {
                bestStatus = 'incorrect-position';
              } else if (result.status === 'incorrect' && bestStatus === 'unused') {
                bestStatus = 'incorrect';
              }
            }
          }
          if (bestStatus === 'correct') break;
        }
        return bestStatus;
    };
  
    return (
      <div className="keyboard">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key) => {
              const isSpecialKey = key === 'ENTER' || key === 'BACKSPACE';
              const status = isSpecialKey ? 'unused' : getKeyStatus(key);

              return (
                <button
                  key={key}
                  className={`keyboard-key ${isSpecialKey ? 'wide' : ''} ${status !== 'unused' ? status : ''}`}
                  onClick={() => onKeyPress(key)}
                >
                  {key === 'BACKSPACE' ? '⌫' : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };