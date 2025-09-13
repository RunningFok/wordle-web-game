import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { GameState, CreateGameStateResponse, GuessResult } from '../types/core';
import { apiService, PlayGameStateError } from '../services/api';
import { getRandomWord } from '../helpers/gameLogic';

type GameMode = 'classic' | 'custom';

interface GameContextType {
  gameState: GameState | null;
  loading: boolean;
  error: string | null;
  createNewGame: (mode: GameMode) => Promise<void>;
  createCustomGame: (wordSize: number, maxTries: number) => Promise<void>;
  createClassicGame: (wordSize: number, maxTries: number) => Promise<void>;
  makeGuess: (guessWord: string) => Promise<void>;
  leaveGame: () => Promise<void>;
  clearError: () => void;
  showInvalidWordPopup: boolean;
  invalidWord: string;
  clearInvalidWordPopup: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInvalidWordPopup, setShowInvalidWordPopup] = useState(false);
  const [invalidWord, setInvalidWord] = useState('');

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearInvalidWordPopup = useCallback(() => {
    setShowInvalidWordPopup(false);
    setInvalidWord('');
  }, []);

  const createNewGame = useCallback(async (mode: GameMode) => {
    setLoading(true);
    setError(null);
    
    try {
      if (mode === 'classic') {
        const newGameState: GameState = {
          currentGuessWord: '',
          tries: [],
          gameStatus: 'playing',
          targetWord: getRandomWord(),
          maxTries: 6,
          wordSize: 5,
          mode: 'classic'
        };
        setGameState(newGameState);
        
      } else if (mode === 'custom') {
        const response: CreateGameStateResponse = await apiService.createGameState();
        
        const newGameState: GameState = {
          id: response.id,
          currentGuessWord: '',
          tries: response.tries,
          gameStatus: response.gameStatus,
          targetWord: response.targetWord,
          maxTries: response.maxTries,
          wordSize: response.wordSize || 5,
          mode: 'custom',
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
        };
        setGameState(newGameState);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create new game');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCustomGame = useCallback(async (wordSize: number, maxTries: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: CreateGameStateResponse = await apiService.createGameState(maxTries, wordSize);
      
      const newGameState: GameState = {
        id: response.id,
        currentGuessWord: '',
        tries: response.tries,
        gameStatus: response.gameStatus,
        targetWord: response.targetWord,
        maxTries: response.maxTries,
        wordSize: response.wordSize || wordSize,
        mode: 'custom',
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      };
      setGameState(newGameState);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create custom game');
    } finally {
      setLoading(false);
    }
  }, []);

  const createClassicGame = useCallback(async (wordSize: number, maxTries: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const newGameState: GameState = {
        currentGuessWord: '',
        tries: [],
        gameStatus: 'playing',
        targetWord: getRandomWord(wordSize),
        maxTries: maxTries,
        wordSize: wordSize,
        mode: 'classic'
      };
      setGameState(newGameState);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create classic game');
    } finally {
      setLoading(false);
    }
  }, []);

  const makeGuess = useCallback(async (guessWord: string) => {
    if (!gameState) {
      setError('No active game found');
      return;
    }

    setLoading(true);
    setError(null);
    setShowInvalidWordPopup(false);

    try {
      if (gameState.mode === 'classic') {
        if (!gameState.targetWord) {
          throw new Error('Target word is required for classic mode');
        }
        
        const { isWordInList } = await import('../helpers/gameLogic');
        if (!isWordInList(guessWord.toUpperCase())) {
          setInvalidWord(guessWord.toUpperCase());
          setShowInvalidWordPopup(true);
          return;
        }
        
        const { evaluateGuessLocal } = await import('../helpers/gameLogic');
        
        const letterResultArray = evaluateGuessLocal(guessWord.toUpperCase(), gameState.targetWord);
        const newGuess: GuessResult = {
          guessWord: guessWord.toUpperCase(),
          letterResultArray: letterResultArray,
          isCorrect: letterResultArray.every(r => r.status === 'correct')
        };
        const newTries = [...gameState.tries, newGuess];
        const isGameWon = newGuess.isCorrect;
        const isGameLost = !isGameWon && newTries.length >= gameState.maxTries;

        setGameState(prev => prev ? ({
          ...prev,
          tries: newTries,
          currentGuessWord: '',
          gameStatus: isGameWon ? 'won' : isGameLost ? 'lost' : 'playing'
        }) : null);
        
      } else if (gameState.mode === 'custom') {
        if (!gameState.id) {
          throw new Error('Game ID is required for API-based modes');
        }

        const response: CreateGameStateResponse = await apiService.playGameState({
          id: gameState.id,
          guessWord: guessWord,
        });

        setGameState(prev => prev ? ({
          ...prev,
          tries: response.tries,
          gameStatus: response.gameStatus,
          currentGuessWord: '',
          updatedAt: response.updatedAt,
        }) : null);
      }
      
    } catch (err) {
      if (err instanceof PlayGameStateError && err.invalidGuessWord) {
        setInvalidWord(err.invalidGuessWord);
        setShowInvalidWordPopup(true);
        return;
      }
    } finally {
      setLoading(false);
    }
  }, [gameState]);

  const leaveGame = useCallback(async () => {
    if (!gameState) {
      setError('No active game found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (gameState.mode === 'classic') {
        setGameState(null);
      } else if (gameState.mode === 'custom') {
        if (!gameState.id) {
          throw new Error('Game ID is required for API-based modes');
        }
        await apiService.leaveGameState(gameState.id);
        setGameState(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave game');
    } finally {
      setLoading(false);
    }
  }, [gameState]);

  const value: GameContextType = {
    gameState,
    loading,
    error,
    createNewGame,
    createCustomGame,
    createClassicGame,
    makeGuess,
    leaveGame,
    clearError,
    showInvalidWordPopup,
    invalidWord,
    clearInvalidWordPopup,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};