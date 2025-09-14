import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getRandomWord } from '../helpers/gameLogic';

export const TypewriterTitle = () => {
    const [currentText, setCurrentText] = useState("WORDLE");
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isWordle, setIsWordle] = useState(true);
  
    useEffect(() => {
      const typeSpeed = isDeleting ? 50 : 100;
      const pauseTime = 2000;
  
      const timer = setTimeout(() => {
        if (!isDeleting && displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else if (isDeleting && displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else if (!isDeleting && displayText.length === currentText.length) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        } else if (isDeleting && displayText.length === 0) {
          setIsDeleting(false);
          if (isWordle) {
            setCurrentText(getRandomWord(5).toUpperCase());
            setIsWordle(false);
          } else {
            setCurrentText("WORDLE");
            setIsWordle(true);
          }
        }
      }, typeSpeed);
  
      return () => clearTimeout(timer);
    }, [displayText, isDeleting, currentText, isWordle]);

    return (
        <div className="App-title" >
          <motion.span
            key={currentText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {displayText}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ marginLeft: '2px' }}
            >
              |
            </motion.span>
          </motion.span>
        </div>
      );
};