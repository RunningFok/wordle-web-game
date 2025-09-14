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
  id?: number;
  currentGuessWord?: string;
  tries: GuessResult[];
  gameStatus: 'playing' | 'won' | 'lost' | 'timeout';
  targetWord?: string;
  maxTries: number;
  wordSize?: number;
  mode: 'classic' | 'speed';
  timeLimit?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGameStateResponse {
  message: string;
  id: number;
  targetWord: string;
  tries: GuessResult[];
  gameStatus: 'playing' | 'won' | 'lost' | 'timeout';
  mode: string;
  maxTries: number;
  wordSize?: number;
  updatedAt: string;
  createdAt: string;
}

export interface PlayGameStateRequest {
  id: number;
  guessWord: string;
}

export interface PlayGameStateErrorType {
  error: string;
  invalid_guess_word?: string;
}
