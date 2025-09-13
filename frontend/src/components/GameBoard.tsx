import React, { useState, useEffect, useCallback } from 'react';
import { GameKeyboard } from './GameKeyboard';
import { GameState, GuessResult } from '../types/core';
import { InvalidWordModal } from './PopupModals';
import { useGame } from '../contexts/GameContext';

interface GameBoardProps {
  gameState: GameState;
}
  
export const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const { makeGuess, loading, showInvalidWordPopup, invalidWord, clearInvalidWordPopup } = useGame();
  const [currentGuessWord, setCurrentGuessWord] = useState('');

  const submitGuess = useCallback(async () => {
    if (currentGuessWord.length !== 5) return;
    if (gameState.gameStatus !== 'playing') return;
    if (loading) return;


    try {
      await makeGuess(currentGuessWord.toUpperCase());
      setCurrentGuessWord('');
    } catch (error) {
      console.error('Error submitting guess:', error);
      alert('Error submitting guess. Please try again.');
    }
  }, [currentGuessWord, gameState.gameStatus, loading, makeGuess]);

  const handleKeyPress = useCallback((key: string) => {
    if (gameState.gameStatus !== 'playing' || loading) return;
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentGuessWord(prev => prev.slice(0, -1));
    } else if (key.length === 1 && key.match(/[A-Z]/)) {
      if (currentGuessWord.length < 5) {
        setCurrentGuessWord(prev => prev + key);
      }
    }
  }, [gameState.gameStatus, currentGuessWord, submitGuess, loading]);

  useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        const key = event.key.toUpperCase();
        if (key === 'ENTER' || key === 'BACKSPACE' || (key.length === 1 && key.match(/[A-Z]/))) {
          event.preventDefault();
          handleKeyPress(key);
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.gameStatus, gameState.currentGuessWord, handleKeyPress]);
      
  const renderTile = (letter: string, status: 'correct' | 'incorrect' | 'incorrect-position' | 'current' | 'empty', index: number) => {
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
            {guess.letterResultArray.map((result, index) => renderTile(result.letter, result.status, index))}
          </div>
        );
      } else if (rowIndex === gameState.tries.length) {
        const currentGuessLetters = currentGuessWord.split('');
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
        <InvalidWordModal 
          isOpen={showInvalidWordPopup} 
          onClose={clearInvalidWordPopup}
          guessWord={invalidWord}
        />
        {Array.from({ length: gameState.maxTries }, (_, index) => 
          renderGuessRow(gameState.tries[index] || null, index)
        )}  
        <GameKeyboard gameState={gameState} onKeyPress={handleKeyPress} />
      </div>
    );
};