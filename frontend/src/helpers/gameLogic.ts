import { LetterResult } from "../types/core";
import { WORD_LIST } from "../data/wordList";

export const evaluateGuessLocal = (guess: string, target: string): LetterResult[] => {
  const letterResultArray: LetterResult[] = [];
  const targetLetters = target.split('');
  const guessLetters = guess.split('');
  const usedTargetIndices = new Set<number>();
  const usedGuessIndices = new Set<number>();

  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      letterResultArray[i] = { letter: guessLetters[i], status: 'correct' };
      usedTargetIndices.add(i);
      usedGuessIndices.add(i);
    }
  }

  for (let i = 0; i < 5; i++) {
    if (letterResultArray[i]) continue;
      
    for (let j = 0; j < 5; j++) {
      if (usedTargetIndices.has(j)) continue;

      if (guessLetters[i] === targetLetters[j]) {
        letterResultArray[i] = { letter: guessLetters[i], status: 'incorrect-position' };
        usedTargetIndices.add(j);
        usedGuessIndices.add(i);
        break;
      }
    }
  }

  for (let i = 0; i < 5; i++) {
    if (!letterResultArray[i]) {
      letterResultArray[i] = { letter: guessLetters[i], status: 'incorrect' };
    }
  }
  return letterResultArray;
};

export const getRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[randomIndex];
};

export const isWordInList = (word: string): boolean => {
  return WORD_LIST.includes(word);
};