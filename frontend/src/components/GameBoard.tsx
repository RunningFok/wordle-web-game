import React from 'react';
import { GameKeyboard } from './GameKeyboard';
import { GameState, GuessResult } from '../types/core';

interface GameBoardProps {
    gameState: GameState;
}
  
export const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {

    const renderTile = (letter: string, status: 'correct' | 'incorrect' | 'wrong-position' | 'current' | 'empty', index: number) => {
        return (
          <div
            key={index}
            className={`letter-tile ${status}`}
          >
            {letter}
          </div>
        );
      };
    
      const renderGuessRow = (guess: GuessResult | null, rowIndex: number) => {
        if (guess) {
          return (
            <div key={rowIndex} className="guess-row">
              {guess.letterResults.map((result, index) => renderTile(result.letter, result.status, index))}
            </div>
          );
        } else if (rowIndex === gameState.tries.length) {
          const currentGuessLetters = gameState.currentGuessWord.split('');
          return (
            <div key={rowIndex} className="guess-row">
              {Array.from({ length: 5 }, (_, index) => {
                const letter = currentGuessLetters[index] || '';
                const status = letter ? 'current' : 'empty';
                return renderTile(letter, status, index);
              })}
            </div>
          );
        } else {
          return (
            <div key={rowIndex} className="guess-row">
              {Array.from({ length: 5 }, (_, index) => renderTile('', 'empty', index))}
            </div>
          );
        }
      };
    
      return (
        <div className="game-board">
          {Array.from({ length: gameState.maxTries }, (_, index) => 
            renderGuessRow(gameState.tries[index] || null, index)
          )}  
          <GameKeyboard />
        </div>
      );
    };