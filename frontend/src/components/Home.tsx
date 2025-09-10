import React from 'react';

export const Home = () => {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Wordle!</h1>
        </header>
        <main className="homepage-container">
            <div className="game-cards">
              <div className="game-card classic-card">
                <button 
                  className="game-button classic-button"
                  onClick={() => {}}
                >
                  Classic Mode
                </button>
              </div>
              <div className="game-card custom-card">
                <button 
                  className="game-button custom-button"
                  onClick={() => {}}
                >
                  Custom Mode
                </button>
              </div>
            </div>
          </main>
      </div>
    );
  };