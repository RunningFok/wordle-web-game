export interface LetterResult {
  letter: string;
  status: 'correct' | 'incorrect-position' | 'incorrect';
}

export interface GuessResult {
  guessWord: string;
  letterResultArray: LetterResult[];
  isCorrect: boolean;
}

export interface GameState {
  currentGuessWord: string;
  tries: GuessResult[];
  gameStatus: 'playing' | 'won' | 'lost';
  targetWord: string;
  maxTries: number;
  mode: 'classic' | 'custom';
}
