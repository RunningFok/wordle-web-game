import React, { useState } from 'react';
import './App.css';
import { Home } from './components/Home';
import { GamePage } from './components/GamePage';

function App() {
  const [selectedMode, setSelectedMode] = useState<'classic' | 'custom'>('classic');
  const [showGame, setShowGame] = useState<boolean>(false);

  const goBackToHome = async () => {
    setShowGame(false);
  };

  const startNewGame = (version: 'classic' | 'custom') => {    
    setSelectedMode(version);
    setShowGame(true);
    };

  if (showGame) {
    return (
      <GamePage
        selectedMode={selectedMode}
        onNewGame={() => startNewGame(selectedMode)}
        onBackToHome={goBackToHome}
      />
    );
  }

  return (
    <Home onStartGame={startNewGame} />
  );
}

export default App;
