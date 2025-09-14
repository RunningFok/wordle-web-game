import React, { useState, useEffect } from 'react';
import './App.css';
import { Home } from './components/Home';
import { GamePage } from './components/GamePage';
import { GameFinishModal } from './components/PopupModals';
import { GameProvider, useGame } from './contexts/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

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

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
