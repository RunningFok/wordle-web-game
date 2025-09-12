import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { GameState, CreateGameStateResponse, GuessResult } from '../types/core';
import { apiService } from '../services/api';
import { getRandomWord } from '../helpers/gameLogic';

type GameMode = 'classic' | 'custom';

interface GameContextType {
  gameState: GameState | null;
  loading: boolean;
  error: string | null;
  createNewGame: (mode: GameMode) => Promise<void>;
  makeGuess: (guessWord: string) => Promise<void>;
  leaveGame: () => Promise<void>;
  clearError: () => void;
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

  const clearError = useCallback(() => {
    setError(null);
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

  const makeGuess = useCallback(async (guessWord: string) => {
    if (!gameState) {
      setError('No active game found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (gameState.mode === 'classic') {
        if (!gameState.targetWord) {
          throw new Error('Target word is required for classic mode');
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
      setError(err instanceof Error ? err.message : 'Failed to make guess');
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
    makeGuess,
    leaveGame,
    clearError,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};