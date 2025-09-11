import React, { useEffect, useCallback } from 'react';
import { GameKeyboard } from './GameKeyboard';
import { GameState, GuessResult, LetterResult } from '../types/core';
import { evaluateGuessLocal } from '../helpers/gameAnalysis';

interface GameBoardProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}
  
export const GameBoard: React.FC<GameBoardProps> = ({ gameState, setGameState }) => {
  const submitGuess = useCallback(async () => {
    if (gameState.currentGuessWord.length !== 5) return;
    if (gameState.gameStatus !== 'playing') return;

    try {
      let results: LetterResult[];
      results = evaluateGuessLocal(gameState.currentGuessWord.toUpperCase(), gameState.targetWord);
      const newGuess: GuessResult = {
        guessWord: gameState.currentGuessWord.toUpperCase(),
        letterResults: results,
        isCorrect: results.every(r => r.status === 'correct')
      };
      const newTries = [...gameState.tries, newGuess];
      const isGameWon = newGuess.isCorrect;
      const isGameLost = !isGameWon && newTries.length >= gameState.maxTries;

      setGameState(prev => ({
        ...prev,
        tries: newTries,
        currentGuessWord: '',
        gameStatus: isGameWon ? 'won' : isGameLost ? 'lost' : 'playing'
      }));
    } catch (error) {
      console.error('Error submitting guess:', error);
      alert('Error submitting guess. Please try again.');
    }
  }, [gameState.currentGuessWord, gameState.gameStatus, gameState.targetWord, gameState.tries, gameState.maxTries, gameState.mode]);

  const handleKeyPress = useCallback((key: string) => {
    if (gameState.gameStatus !== 'playing') return;
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      setGameState(prev => ({
        ...prev,
        currentGuessWord: prev.currentGuessWord.slice(0, -1)
      }));
    } else if (key.length === 1 && key.match(/[A-Z]/)) {
      if (gameState.currentGuessWord.length < 5) {
        setGameState(prev => ({
          ...prev,
          currentGuessWord: prev.currentGuessWord + key
        }));
      }
    }
  }, [gameState.gameStatus, gameState.currentGuessWord, submitGuess]);

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
        <GameKeyboard gameState={gameState} onKeyPress={handleKeyPress} />
      </div>
    );
};