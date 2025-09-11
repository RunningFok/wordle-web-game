import React, { useState, useEffect } from 'react';
import './App.css';
import { Home } from './components/Home';
import { GamePage } from './components/GamePage';
import { GameFinishModal } from './components/PopupModals';
import { GameState } from './types/core';
import { getRandomWord } from './helpers/gameLogic';

const DEFAULT_GAME_STATE: GameState = {
  currentGuessWord: '',
  tries: [],
  gameStatus: 'playing',
  targetWord: getRandomWord(),
  maxTries: 6,
  mode: 'classic'
};

function App() {
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);
  const [showGame, setShowGame] = useState<boolean>(false);
  const [showGameFinish, setShowGameFinish] = useState(false);

  useEffect(() => {
    if (gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') {
      setShowGameFinish(true);
    } else {
      setShowGameFinish(false);
    }
  }, [gameState.gameStatus]);

  const goBackToHome = () => {
    setShowGame(false);
    setShowGameFinish(false);
  };

  const startNewGame = (gameMode: 'classic' | 'custom') => {    
    setGameState({
      ...DEFAULT_GAME_STATE,
      targetWord: getRandomWord(),
      mode: gameMode
    });
    setShowGame(true);
  };

  const playAgainGame = () => {
    setGameState({
      ...DEFAULT_GAME_STATE,
      targetWord: getRandomWord(),
    });
    setShowGameFinish(false);
  };

  return (
    <div>
      {showGame ? (
        <GamePage
          gameState={gameState}
          setGameState={setGameState}
          onNewGame={() => startNewGame(gameState.mode)}
          onBackToHome={goBackToHome}
        />
      ) : (
        <Home onStartGame={startNewGame} />
      )}
      
      <GameFinishModal
        isOpen={showGameFinish}
        onClose={() => setShowGameFinish(false)}
        gameStatus={gameState.gameStatus as 'won' | 'lost'}
        targetWord={gameState.targetWord}
        onPlayAgain={playAgainGame}
        onBackToHome={goBackToHome}
      />
    </div>
  );
}

export default App;
