package models

import (
	"encoding/json"
	"fmt"
	"time"
	"wordle-backend/database"
	"wordle-backend/helpers"
)

type LetterResult struct {
	Letter string `json:"letter"`
	Status string `json:"status"`
}

type GuessResult struct {
	GuessWord     string         `json:"guessWord"`
	Results   []LetterResult `json:"results"`
	IsCorrect bool           `json:"isCorrect"`
}

type GameState struct {
	ID          int64     `json:"id"`
	TargetWord  string    `json:"targetWord"`
	Tries []GuessResult `json:"tries"`
	GameStatus string    `json:"gameStatus"`
	Mode string    `json:"mode"`
	MaxTries    int       `json:"maxTries"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

func CreateGameState() (GameState, error) {
	now := time.Now()
	
	randomWord := helpers.GetRandomWord()
	nextID, err := helpers.GetNextID("game_states")
	if err != nil {
		return GameState{}, err
	}
	
	return GameState{
		ID:         nextID,
		TargetWord: randomWord,
		Tries: []GuessResult{},
		GameStatus: "playing",
		Mode: "classic",
		MaxTries:   6,
		CreatedAt:  now,
		UpdatedAt:  now,
	}, nil
}

func SaveGameState(gameState GameState) error {
	triesJSON, err := json.Marshal(gameState.Tries)
	if err != nil {
		return fmt.Errorf("failed to marshal tries to JSON: %v", err)
	}
	
	query := `
		INSERT INTO game_states (id, target_word, tries, game_status, mode, max_tries, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`
	
	_, err = database.DB.Exec(query, gameState.ID, gameState.TargetWord, string(triesJSON), gameState.GameStatus, gameState.Mode, gameState.MaxTries, gameState.CreatedAt, gameState.UpdatedAt)
	if err != nil {
		return fmt.Errorf("failed to save game state: %v", err)
	}
	
	return nil
}
