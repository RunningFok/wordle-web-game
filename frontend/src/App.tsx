// Wordle Web Game - Main Application Component
//
// ARCHITECTURE DECISION: Component-based architecture with Context API for state management
// - Separation of concerns: App handles routing, GameContext manages game state
// - Framer Motion for smooth transitions and enhanced UX
// - Modal system for game completion feedback
//
// DESIGN PATTERNS USED:
// - Provider Pattern: GameProvider wraps entire app for global state access
// - Render Props: Conditional rendering based on game state
//
// TRADE-OFFS CONSIDERED:
// - Context vs Redux: Context chosen for simpler state management
// - Class vs Functional Components: Functional for hooks and modern React patterns
//
// PERFORMANCE OPTIMIZATIONS:
// - Conditional rendering to avoid unnecessary component mounting
// - useCallback for stable function references
import React, { useState, useEffect } from 'react';
import './App.css';
import { Home } from './components/Home';
import { GamePage } from './components/GamePage';
import { GameFinishModal } from './components/PopupModals';
import { GameProvider, useGame } from './contexts/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

// AppContent handles the main application logic and routing between Home and Game views
// STATE MANAGEMENT: Uses GameContext for centralized game state management
function AppContent() {
  const { gameState, showGame, createSpeedGame, createClassicGame, error, clearError, backToHome } = useGame();
  const [showGameFinish, setShowGameFinish] = useState(false);

  useEffect(() => {
    if (gameState?.gameStatus === 'won' || gameState?.gameStatus === 'lost' || gameState?.gameStatus === 'timeout') {
      setShowGameFinish(true);
    } else {
      setShowGameFinish(false);
    }
  }, [gameState?.gameStatus]);

  const goBackToHome = () => {
    backToHome();
    setShowGameFinish(false);
  };

  // Factory function for creating games with different configurations
  // DESIGN PATTERN: Strategy pattern for different game modes
  const startNewGameWithConfig = async (gameMode: 'classic' | 'speed', wordSize: number, maxTries: number, timeLimit?: number) => {
    if (gameMode === 'classic') {
      await createClassicGame(wordSize, maxTries);
    } else {
      await createSpeedGame(wordSize, maxTries, timeLimit || 45);
    }
  };

  const playAgainGame = async () => {
    if (gameState) {
      await startNewGameWithConfig(gameState.mode, gameState.wordSize || 5, gameState.maxTries, gameState.timeLimit);
      setShowGameFinish(false);
    }
  };

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={clearError}>Clear Error</button>
      </div>
    );
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {showGame && gameState ? (
          <motion.div
            key="game"
            initial={{ 
              filter: "blur(15px)",
              x: 100,
              opacity: 0.25
            }}
            animate={{ 
              filter: "blur(0px)",
              x: 0,
              opacity: 1
            }}
            exit={{ 
              filter: "blur(15px)",
              x: -100,
              opacity: 0.25
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ willChange: "filter, transform, opacity" }}
          >
            <GamePage
              gameState={gameState}
              onNewGame={() => startNewGameWithConfig(gameState.mode, gameState.wordSize || 5, gameState.maxTries, gameState.timeLimit)}
              onBackToHome={goBackToHome}
            />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ 
              filter: "blur(15px)",
              x: -100,
              opacity: 0.25
            }}
            animate={{ 
              filter: "blur(0px)",
              x: 0,
              opacity: 1
            }}
            exit={{ 
              filter: "blur(15px)",
              x: 100,
              opacity: 0.25
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ willChange: "filter, transform, opacity" }}
          >
            <Home />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Game completion modal - only shows when game ends and target word is available */}
      {/* UX DECISION: Modal provides immediate feedback and clear next actions */}
      {gameState && gameState.targetWord && (
        <GameFinishModal
          isOpen={showGameFinish}
          onClose={() => setShowGameFinish(false)}
          gameStatus={gameState.gameStatus as 'won' | 'lost' | 'timeout'}
          targetWord={gameState.targetWord}
          onPlayAgain={playAgainGame}
          onBackToHome={goBackToHome}
        />
      )}
    </div>
  );
}

// Root App component with Context Provider
// ARCHITECTURE: Provider pattern for global state management
function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
