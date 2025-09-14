import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../contexts/GameContext';

export interface MenuContentProps {
  mode: 'classic' | 'speed' | 'rules';
}

export const MenuContent: React.FC<MenuContentProps> = ({
  mode,
}) => {
  const { createSpeedGame, createClassicGame } = useGame();
  const defaultGameSettings = {
    wordSize: 5,
    maxTries: 6,
    timeLimit: 45,
  };
  
  const wordSizeOptions = [4, 5, 6];
  const maxTriesOptions = [5, 6, 7];
  const timeLimitOptions = [30, 45, 60];

  const [wordSize, setWordSize] = useState(defaultGameSettings.wordSize);
  const [maxTries, setMaxTries] = useState(defaultGameSettings.maxTries);
  const [timeLimit, setTimeLimit] = useState(defaultGameSettings.timeLimit);
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  const handleStartGame = async () => {
    if (mode === 'classic') {
      await createClassicGame(wordSize, maxTries);
    } else if (mode === 'speed') {
      await createSpeedGame(wordSize, maxTries, timeLimit);
    }
  };

  const toggleAccordion = (accordionId: string) => {
    setOpenAccordions(prev => 
      prev.includes(accordionId) 
        ? prev.filter(id => id !== accordionId)
        : [...prev, accordionId]
    );
  };

  const toggleSettingsExpansion = () => {
    setIsSettingsExpanded(!isSettingsExpanded);
  };

  const getTitle = () => {
    switch (mode) {
      case 'classic': return <h2 className="classic-mode">Classic Mode</h2>;
      case 'speed': return <h2 className="speed-mode">Speed Mode</h2>;
      case 'rules': return <h2>How to Play</h2>;
      default: return '';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'classic': return 'Take your time to think and guess the word.';
      case 'speed': return 'Race against the clock to solve the word quickly!';
      case 'rules': return 'Learn how to play and understand the game modes';
      default: return '';
    }
  };
  const getSettingsSummary = () => {
    if (mode === 'speed') {
      return `${wordSize} Letters • ${maxTries} Tries • ${timeLimit}s`;
    }
    return `${wordSize} Letters • ${maxTries} Tries`;
  };

  const getLayoutIdPrefix = () => {
    return mode === 'speed' ? 'speed' : 'classic';
  };

  const getButtonClassName = () => {
    return mode === 'speed' ? 'start-game-button speed-button' : 'start-game-button';
  };

  if (mode === 'rules') {
    return (
      <motion.div
        key="rules"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="rules-content"
      >
        <div className="accordion">
          <div className="accordion-item">
            <button 
              className="accordion-header"
              onClick={() => toggleAccordion('how-to-play')}
            >
              <span>How to Play Wordle</span>
              <motion.div
                animate={{ rotate: openAccordions.includes('how-to-play') ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="accordion-icon"
              >
                ▼
              </motion.div>
            </button>
            <AnimatePresence>
              {openAccordions.includes('how-to-play') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="accordion-content"
                >
                  <div className="rules-section">
                    <h3>Objective</h3>
                    <p>Guess the hidden word in 6 tries or less!</p>
                  </div>
                  <div className="rules-section">
                    <h3>How to Play</h3>
                    <ul>
                      <li>Each guess must be a valid 5-letter word</li>
                      <li>Press Enter to submit your guess</li>
                      <li>After each guess, the color of the tiles will change to show how close your guess was to the word</li>
                    </ul>
                  </div>
                  <div className="rules-section">
                    <h3>Color Meanings</h3>
                    <div className="color-examples">
                      <div className="color-example">
                        <div className="tile green">W</div>
                        <span>Green: Correct letter in correct position</span>
                      </div>
                      <div className="color-example">
                        <div className="tile yellow">E</div>
                        <span>Yellow: Correct letter in wrong position</span>
                      </div>
                      <div className="color-example">
                        <div className="tile gray">A</div>
                        <span>Gray: Letter not in the word</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="accordion-item">
            <button 
              className="accordion-header"
              onClick={() => toggleAccordion('game-modes')}
            >
              <span>Game Modes</span>
              <motion.div
                animate={{ rotate: openAccordions.includes('game-modes') ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="accordion-icon"
              >
                ▼
              </motion.div>
            </button>
            <AnimatePresence>
              {openAccordions.includes('game-modes') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="accordion-content"
                >
                  <div className="rules-section">
                    <h3 className="classic-mode">Classic Mode</h3>
                    <p>Take your time to think and guess the word. No time pressure!</p>
                    <ul>
                      <li>Configure word size (4-6 letters)</li>
                      <li>Set maximum tries (5-7 attempts)</li>
                      <li>Think carefully about each guess</li>
                    </ul>
                  </div>
                  <div className="rules-section">
                    <h3 className="speed-mode">Speed Mode</h3>
                    <p>Race against the clock to solve the word as quickly as possible!</p>
                    <ul>
                      <li>Configure word size (4-6 letters)</li>
                      <li>Set maximum tries (5-7 attempts)</li>
                      <li>Choose time limit (30-60 seconds)</li>
                      <li>Think fast and make quick decisions</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={mode}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="game-config-content"
    >
      {getTitle()}
      <p>{getDescription()}</p>
      
      <div className="smart-settings-container">
        <button 
          className="smart-settings-display"
          onClick={toggleSettingsExpansion}
        >
          <span className="settings-summary">
            {getSettingsSummary()}
          </span>
          <motion.div
            animate={{ rotate: isSettingsExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="settings-expand-icon"
          >
            ▼
          </motion.div>
        </button>
        
        <AnimatePresence>
          {isSettingsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="smart-settings-content"
            >
              <div className="setting-group">
                <h3>Word Size</h3>
                <div className="setting-tabs-container">
                  <div className="setting-tabs-header">
                    {wordSizeOptions.map(size => (
                      <button
                        key={size}
                        className={`setting-tab-button ${wordSize === size ? 'active' : ''}`}
                        onClick={() => setWordSize(size)}
                      >
                        {size} Letters
                        {wordSize === size && (
                          <motion.div
                            className="setting-tab-indicator"
                            data-mode={mode}
                            layoutId={`wordSize-${getLayoutIdPrefix()}-indicator`}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="setting-group">
                <h3>Max Tries</h3>
                <div className="setting-tabs-container">
                  <div className="setting-tabs-header">
                    {maxTriesOptions.map(tries => (
                      <button
                        key={tries}
                        className={`setting-tab-button ${maxTries === tries ? 'active' : ''}`}
                        onClick={() => setMaxTries(tries)}
                      >
                        {tries} Tries
                        {maxTries === tries && (
                          <motion.div
                            className="setting-tab-indicator"
                            data-mode={mode}
                            layoutId={`maxTries-${getLayoutIdPrefix()}-indicator`}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {mode === 'speed' && (
                <div className="setting-group">
                  <h3>Time Limit</h3>
                  <div className="setting-tabs-container">
                    <div className="setting-tabs-header">
                      {timeLimitOptions.map(seconds => (
                        <button
                          key={seconds}
                          className={`setting-tab-button ${timeLimit === seconds ? 'active' : ''}`}
                          onClick={() => setTimeLimit(seconds)}
                        >
                          {seconds}s
                          {timeLimit === seconds && (
                            <motion.div
                              className="setting-tab-indicator"
                              data-mode={mode}
                              layoutId="timeLimit-indicator"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="game-start-section">
        <button 
          className={getButtonClassName()}
          onClick={handleStartGame}
        >
          Start Game
        </button>
      </div>
    </motion.div>
  );
};
