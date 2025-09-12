import { CreateGameStateResponse, GameState, PlayGameStateRequest } from '../types/core';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export interface ApiError {
  error: string;
}

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
      const errorData: ApiError = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async createGameState(): Promise<CreateGameStateResponse> {
    return this.makeRequest<CreateGameStateResponse>('/gamestates', {
      method: 'POST',
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

  async playGameState(request: PlayGameStateRequest): Promise<CreateGameStateResponse> {
    return this.makeRequest<CreateGameStateResponse>('/gamestates', {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }

  async leaveGameState(id: number): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`/gamestates/${id}`, {
      method: 'PUT',
    });
  }
}

export const apiService = new ApiService();
