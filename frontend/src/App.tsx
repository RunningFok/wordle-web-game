import React, { useState } from 'react';
import './App.css';
import { Home } from './components/Home';
import { GamePage } from './components/GamePage';
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

  const goBackToHome = async () => {
    setShowGame(false);
  };

  const startNewGame = (gameMode: 'classic' | 'custom') => {    
    setGameState({
      ...DEFAULT_GAME_STATE,
      targetWord: getRandomWord(),
      mode: gameMode
    });
    setShowGame(true);
  };

  if (showGame) {
    return (
      <GamePage
        gameState={gameState}
        setGameState={setGameState}
        onNewGame={() => startNewGame(gameState.mode)}
        onBackToHome={goBackToHome}
      />
    );
  }

  return (
    <Home onStartGame={startNewGame} />
  );
}

export default App;
