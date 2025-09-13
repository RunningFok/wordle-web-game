import React, { useState, useEffect } from 'react';
import './App.css';
import { Home } from './components/Home';
import { GamePage } from './components/GamePage';
import { GameFinishModal } from './components/PopupModals';
import { GameProvider, useGame } from './contexts/GameContext';

function AppContent() {
  const { gameState, createNewGame, createCustomGame, error, clearError } = useGame();
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

  const startNewGame = async (gameMode: 'classic' | 'custom') => {
    await createNewGame(gameMode);
    setShowGame(true);
  };

  const startCustomGame = async (wordSize: number, maxTries: number) => {
    await createCustomGame(wordSize, maxTries);
    setShowGame(true);
  };

  const playAgainGame = async () => {
    if (gameState) {
      await createNewGame(gameState.mode);
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
          onNewGame={() => startNewGame(gameState.mode)}
          onBackToHome={goBackToHome}
        />
      ) : (
        <Home onStartGame={startNewGame} onStartCustomGame={startCustomGame} />
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
