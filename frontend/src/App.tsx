import React, { useState, useEffect } from 'react';
import './App.css';
import { Home } from './components/Home';
import { GamePage } from './components/GamePage';
import { GameFinishModal } from './components/PopupModals';
import { GameProvider, useGame } from './contexts/GameContext';

function AppContent() {
  const { gameState, createNewGame, createSpeedGame, createClassicGame, error, clearError } = useGame();
  const [showGame, setShowGame] = useState<boolean>(false);
  const [showGameFinish, setShowGameFinish] = useState(false);

  useEffect(() => {
    if (gameState?.gameStatus === 'won' || gameState?.gameStatus === 'lost') {
      setShowGameFinish(true);
    } else {
      setShowGameFinish(false);
    }
  }, [gameState?.gameStatus]);

  const goBackToHome = () => {
    setShowGame(false);
    setShowGameFinish(false);
  };

  const startNewGame = async (gameMode: 'classic' | 'speed') => {
    await createNewGame(gameMode);
    setShowGame(true);
  };

  const startNewGameWithConfig = async (gameMode: 'classic' | 'speed', wordSize: number, maxTries: number, timeLimit?: number) => {
    if (gameMode === 'classic') {
      await createClassicGame(wordSize, maxTries);
    } else {
      await createSpeedGame(wordSize, maxTries, timeLimit || 45);
    }
    setShowGame(true);
  };

  const startSpeedGame = async (wordSize: number, maxTries: number, timeLimit: number) => {
    await createSpeedGame(wordSize, maxTries, timeLimit);
    setShowGame(true);
  };

  const startClassicGame = async (wordSize: number, maxTries: number) => {
    await createClassicGame(wordSize, maxTries);
    setShowGame(true);
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
      {showGame && gameState ? (
        <GamePage
          gameState={gameState}
          onNewGame={() => startNewGameWithConfig(gameState.mode, gameState.wordSize || 5, gameState.maxTries)}
          onBackToHome={goBackToHome}
        />
      ) : (
        <Home 
          onStartSpeedGame={startSpeedGame} 
          onStartClassicGame={startClassicGame} 
        />
      )}
      
      {gameState && gameState.targetWord && (
        <GameFinishModal
          isOpen={showGameFinish}
          onClose={() => setShowGameFinish(false)}
          gameStatus={gameState.gameStatus as 'won' | 'lost'}
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
