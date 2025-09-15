// Game Context - Centralized State Management for Wordle Game
//
// ARCHITECTURE DECISION: Context API for global state management
// - Single source of truth for game state across all components
// - Encapsulates API communication and business logic
// - Provides clean separation between UI and data layer
//
// DESIGN PATTERNS USED:
// - Context Provider Pattern: Centralized state management
// - Custom Hook Pattern: useGame() for clean component integration
// - Strategy Pattern: Different game modes (classic vs speed) handled polymorphically
//
// TRADE-OFFS CONSIDERED:
// - Context vs Redux: Context chosen for simpler state management and fewer dependencies
// - Local vs Server State: Hybrid approach - classic mode is local, speed mode is server-based
//
// PERFORMANCE CONSIDERATIONS:
// - useCallback for stable function references to prevent unnecessary re-renders
// - Conditional API calls based on game mode
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { GameState, CreateGameStateResponse, PlayGameStateResponse, GuessResult } from '../types/core';
import { apiService, PlayGameStateError } from '../services/api';
import { getRandomWord } from '../helpers/gameLogic';

// GameContextType defines the contract for game state management
// DESIGN DECISION: Comprehensive interface covering all game operations
// - Async operations for API calls with proper error handling
// - Timer management for speed mode games
// - Popup state management for user feedback
interface GameContextType {
  gameState: GameState | null;
  loading: boolean;
  error: string | null;
  showGame: boolean;
  createSpeedGame: (wordSize: number, maxTries: number, timeLimit: number) => Promise<void>;
  createClassicGame: (wordSize: number, maxTries: number) => Promise<void>;
  makeGuess: (guessWord: string) => Promise<void>;
  leaveGame: () => Promise<void>;
  clearError: () => void;
  showInvalidWordPopup: boolean;
  invalidWord: string;
  clearInvalidWordPopup: () => void;
  timeLeft: number;
  resetTimer: () => void;
  backToHome: () => void;
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
  const [showGame, setShowGame] = useState(false);
  const [showInvalidWordPopup, setShowInvalidWordPopup] = useState(false);
  const [invalidWord, setInvalidWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(45);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearInvalidWordPopup = useCallback(() => {
    setShowInvalidWordPopup(false);
    setInvalidWord('');
  }, []);

  const resetTimer = useCallback(() => {
    setTimeLeft(gameState?.timeLimit || 45);
  }, [gameState?.timeLimit]);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 0.1;
        if (newTime <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setTimeout(async () => {
            if (gameState?.mode === 'speed' && gameState?.id && gameState?.gameStatus === 'playing') {
              try {
                const response = await apiService.timeoutGameState(gameState.id);
                setGameState(prev => prev ? ({
                  ...prev,
                  gameStatus: response.gameStatus,
                  targetWord: response.targetWord,
                  updatedAt: response.updatedAt,
                }) : null);
              } catch (error) {
                console.error('Failed to set game state status to timeout on backend:', error);
                setGameState(prev => prev ? ({
                  ...prev,
                  gameStatus: 'timeout',
                }) : null);
              }
            }
          }, 500);
          return 0;
        }
        return newTime;
      });
    }, 100);
  }, [gameState?.mode, gameState?.id, gameState?.gameStatus]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const backToHome = useCallback(() => {
    stopTimer();
    setShowGame(false);
  }, [stopTimer]);

  useEffect(() => {
    if (gameState?.mode === 'speed' && gameState?.gameStatus === 'playing') {
      startTimer();
    } else {
      stopTimer();
    }

    return () => {
      stopTimer();
    };
  }, [gameState?.mode, gameState?.gameStatus, startTimer, stopTimer]);

  const createSpeedGame = useCallback(async (wordSize: number, maxTries: number, timeLimit: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: CreateGameStateResponse = await apiService.createGameState(maxTries, wordSize);
      
      const newGameState: GameState = {
        id: response.id,
        currentGuessWord: '',
        tries: response.tries,
        gameStatus: response.gameStatus,
        maxTries: response.maxTries,
        wordSize: response.wordSize || wordSize,
        mode: 'speed',
        timeLimit: timeLimit,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      };
      setGameState(newGameState);
      
      setTimeLeft(timeLimit);
      
      setShowGame(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create speed game');
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
      
      setShowGame(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create classic game');
    } finally {
      setLoading(false);
    }
  }, []);

  // Core game logic for processing player guesses
  // STRATEGY PATTERN: Different handling for classic vs speed modes
  // ERROR HANDLING: Comprehensive error handling with user-friendly messages
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
        // Classic mode: Client-side game logic for offline play
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
        
        // Evaluate guess using local game logic
        const letterResultArray = evaluateGuessLocal(guessWord.toUpperCase(), gameState.targetWord);
        const newGuess: GuessResult = {
          guessWord: guessWord.toUpperCase(),
          letterResultArray: letterResultArray,
          isCorrect: letterResultArray.every(r => r.status === 'correct')
        };
        const newTries = [...gameState.tries, newGuess];
        const isGameWon = newGuess.isCorrect;
        const isGameLost = !isGameWon && newTries.length >= gameState.maxTries;

        // Update local state
        setGameState(prev => prev ? ({
          ...prev,
          tries: newTries,
          currentGuessWord: '',
          gameStatus: isGameWon ? 'won' : isGameLost ? 'lost' : 'playing'
        }) : null);
        
      } else if (gameState.mode === 'speed') {
        // Speed mode: Server-side game logic for competitive play
        if (!gameState.id) {
          throw new Error('Game ID is required for API-based modes');
        }

        const response: PlayGameStateResponse = await apiService.playGameState({
          id: gameState.id,
          guessWord: guessWord,
        });

        // Update state with server response
        setGameState(prev => prev ? ({
          ...prev,
          tries: response.tries,
          gameStatus: response.gameStatus,
          currentGuessWord: '',
          updatedAt: response.updatedAt,
          ...(response.targetWord && { targetWord: response.targetWord }),
        }) : null);

        resetTimer();
      
      }
      
    } catch (err) {
      // Handle invalid word errors with user-friendly popup
      if (err instanceof PlayGameStateError && err.invalidGuessWord) {
        setInvalidWord(err.invalidGuessWord);
        setShowInvalidWordPopup(true);
        return;
      }
      // Re-throw other errors to be handled by error boundary
      throw err;
    } finally {
      setLoading(false);
    }
  }, [gameState, resetTimer]);

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
      } else if (gameState.mode === 'speed') {
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
    showGame,
    createSpeedGame,
    createClassicGame,
    makeGuess,
    leaveGame,
    clearError,
    showInvalidWordPopup,
    invalidWord,
    clearInvalidWordPopup,
    timeLeft,
    resetTimer,
    backToHome,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};