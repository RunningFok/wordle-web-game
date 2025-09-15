// API Service - Centralized HTTP Client for Backend Communication
//
// ARCHITECTURE DECISION: Service layer pattern for API abstraction
// - Single responsibility: Handle all HTTP communication with backend
// - Error handling: Custom error types for different failure scenarios
//
// DESIGN PATTERNS USED:
// - Service Layer Pattern: Encapsulates all API communication
// - Error Handling Pattern: Custom error classes for different error types
//
// TRADE-OFFS CONSIDERED:
// - Global vs Local Error Handling: Hybrid approach with custom error types
//
// PERFORMANCE CONSIDERATIONS:
// - TypeScript interfaces for compile-time type safety
import { CreateGameStateResponse, GameState, PlayGameStateRequest, PlayGameStateResponse, GameLostResponse, PlayGameStateErrorType } from '../types/core';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Custom error class for invalid word submissions
// DESIGN DECISION: Specific error type for better error handling in UI
// Contains the invalid word for user feedback
export class PlayGameStateError extends Error {
  public invalidGuessWord?: string;
  
  constructor(message: string, invalidGuessWord?: string) {
    super(message);
    this.name = 'PlayGameStateError';
    this.invalidGuessWord = invalidGuessWord;
  }
}

// Main API service class with generic HTTP request handling
// DESIGN PATTERN: Template method pattern for consistent request handling
class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const errorData: PlayGameStateErrorType = await response.json();
      if (errorData.invalid_guess_word) {
        throw new PlayGameStateError(
          errorData.error || `HTTP error! status: ${response.status}`,
          errorData.invalid_guess_word
        );
      }
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async createGameState(maxTries?: number, wordSize?: number): Promise<CreateGameStateResponse> {
    const body = maxTries && wordSize ? { maxTries, wordSize } : {};
    return this.makeRequest<CreateGameStateResponse>('/gamestates', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async getAllGameStates(): Promise<GameState[]> {
    return this.makeRequest<GameState[]>('/gamestates', {
      method: 'GET',
    });
  }

  async getGameStateById(id: number): Promise<GameState> {
    return this.makeRequest<GameState>(`/gamestates/${id}`, {
      method: 'GET',
    });
  }

  async playGameState(request: PlayGameStateRequest): Promise<PlayGameStateResponse> {
    return this.makeRequest<PlayGameStateResponse>('/gamestates', {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }

  async leaveGameState(id: number): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`/gamestates/${id}`, {
      method: 'PUT',
    });
  }

  async timeoutGameState(id: number): Promise<GameLostResponse> {
    return this.makeRequest<GameLostResponse>(`/gamestates/${id}/timeout`, {
      method: 'PUT',
    });
  }
}

export const apiService = new ApiService();
