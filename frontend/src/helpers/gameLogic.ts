import { LetterResult } from "../types/core";
import { FOUR_LETTER_WORD_LIST, FIVE_LETTER_WORD_LIST, SIX_LETTER_WORD_LIST } from "../data/wordList";

export const evaluateGuessLocal = (guess: string, target: string): LetterResult[] => {
  const letterResultArray: LetterResult[] = [];
  const targetLetters = target.split('');
  const guessLetters = guess.split('');
  const usedTargetIndices = new Set<number>();
  const usedGuessIndices = new Set<number>();
  const wordLength = target.length;

  for (let i = 0; i < wordLength; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      letterResultArray[i] = { letter: guessLetters[i], status: 'correct' };
      usedTargetIndices.add(i);
      usedGuessIndices.add(i);
    }
  }

  for (let i = 0; i < wordLength; i++) {
    if (letterResultArray[i]) continue;
      
    for (let j = 0; j < wordLength; j++) {
      if (usedTargetIndices.has(j)) continue;

      if (guessLetters[i] === targetLetters[j]) {
        letterResultArray[i] = { letter: guessLetters[i], status: 'incorrect-position' };
        usedTargetIndices.add(j);
        usedGuessIndices.add(i);
        break;
      }
    }
  }

  for (let i = 0; i < wordLength; i++) {
    if (!letterResultArray[i]) {
      letterResultArray[i] = { letter: guessLetters[i], status: 'incorrect' };
    }
  }
  return letterResultArray;
};

export const getRandomWord = (wordSize: number = 5): string => {
  let wordList: string[];
  
  switch (wordSize) {
    case 4:
      wordList = FOUR_LETTER_WORD_LIST;
      break;
    case 5:
      wordList = FIVE_LETTER_WORD_LIST;
      break;
    case 6:
      wordList = SIX_LETTER_WORD_LIST;
      break;
    default:
      wordList = FIVE_LETTER_WORD_LIST;
  }
  
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex];
};

export const isWordInList = (word: string): boolean => {
  const wordLength = word.length;
  
  switch (wordLength) {
    case 4:
      return FOUR_LETTER_WORD_LIST.includes(word);
    case 5:
      return FIVE_LETTER_WORD_LIST.includes(word);
    case 6:
      return SIX_LETTER_WORD_LIST.includes(word);
    default:
      return false;
  }
};