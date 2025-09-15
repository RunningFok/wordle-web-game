// Game Logic Helpers - Core Wordle Game Algorithm Implementation
//
// ARCHITECTURE DECISION: Pure functions for game logic with no side effects
// - Client-side game logic for classic mode (offline play)
// - Identical algorithm to backend for consistency
//
// DESIGN PATTERNS USED:
// - Pure Function Pattern: No side effects, predictable outputs
// - Strategy Pattern: Different word lists for different word sizes
// - Factory Pattern: getRandomWord function for word selection
//
// TRADE-OFFS CONSIDERED:
// - Client vs Server Logic: Client logic for offline play, server for competitive
// - Algorithm Complexity: Two-pass algorithm for accuracy vs single-pass for speed
//
// PERFORMANCE CONSIDERATIONS:
// - Pre-loaded word lists for instant validation
// - Efficient letter counting with Set data structures
import { LetterResult } from "../types/core";
import { FOUR_LETTER_WORD_LIST, FIVE_LETTER_WORD_LIST, SIX_LETTER_WORD_LIST } from "../data/wordList";

// Core Wordle algorithm implementation - identical to backend for consistency
// ALGORITHM: Two-pass approach for accurate letter evaluation
// - First pass: Mark exact position matches (green squares)
// - Second pass: Mark position mismatches (yellow squares) with proper counting
//
// BUSINESS RULE: Each letter in target word can only be matched once
// This prevents over-counting duplicate letters in guesses
export const evaluateGuessLocal = (guess: string, target: string): LetterResult[] => {
  const letterResultArray: LetterResult[] = [];
  const targetLetters = target.split('');
  const guessLetters = guess.split('');
  const usedTargetIndices = new Set<number>(); // Track taken target letters
  const usedGuessIndices = new Set<number>();  // Track processed guess letters
  const wordLength = target.length;

  // First pass: Mark exact position matches (green squares)
  for (let i = 0; i < wordLength; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      letterResultArray[i] = { letter: guessLetters[i], status: 'correct' };
      usedTargetIndices.add(i);
      usedGuessIndices.add(i);
    }
  }

  // Second pass: Mark position mismatches (yellow squares)
  // Only mark as yellow if letter exists in target and hasn't been over-consumed
  for (let i = 0; i < wordLength; i++) {
    if (letterResultArray[i]) continue; // Skip already taken letters
      
    for (let j = 0; j < wordLength; j++) {
      if (usedTargetIndices.has(j)) continue; // Skip already taken letters

      if (guessLetters[i] === targetLetters[j]) {
        letterResultArray[i] = { letter: guessLetters[i], status: 'incorrect-position' };
        usedTargetIndices.add(j);
        usedGuessIndices.add(i);
        break; // Found match, move to next guess letter
      }
    }
  }

  // Third pass: Mark remaining letters as incorrect (gray squares)
  for (let i = 0; i < wordLength; i++) {
    if (!letterResultArray[i]) {
      letterResultArray[i] = { letter: guessLetters[i], status: 'incorrect' };
    }
  }
  return letterResultArray;
};

// Factory function for random word selection
// DESIGN PATTERN: Strategy pattern for different word sizes
export const getRandomWord = (wordSize: number = 5): string => {
  let wordList: string[];
  
  // Select appropriate word list based on game configuration
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
  
  // Generate random index for word selection
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex];
};

// Word validation function for guess verification
// BUSINESS RULE: Only valid words from curated lists are accepted
export const isWordInList = (word: string): boolean => {
  const wordLength = word.length;
  
  // Validate against appropriate word list
  switch (wordLength) {
    case 4:
      return FOUR_LETTER_WORD_LIST.includes(word);
    case 5:
      return FIVE_LETTER_WORD_LIST.includes(word);
    case 6:
      return SIX_LETTER_WORD_LIST.includes(word);
    default:
      return false; // Invalid word length
  }
};