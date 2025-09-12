package models

import (
	"encoding/json"
	"fmt"
	"strings"
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
	LetterResultArray   []LetterResult `json:"letterResultArray"`
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

func GetAllGameStates() ([]GameState, error) {
	var gameStates []GameState
	
	query := `
		SELECT id, target_word, tries, game_status, mode, max_tries, created_at, updated_at
		FROM game_states
	`
	
	rows, err := database.DB.Query(query)
	if err != nil {
		return []GameState{}, fmt.Errorf("failed to get all game states: %v", err)
	}
	defer rows.Close()
	
	for rows.Next() {
		var gameState GameState
		var triesJSON string
		
		err := rows.Scan(
			&gameState.ID,
			&gameState.TargetWord,
			&triesJSON,
			&gameState.GameStatus,
			&gameState.Mode,
			&gameState.MaxTries,
			&gameState.CreatedAt,
			&gameState.UpdatedAt,
		)
		if err != nil {
			return []GameState{}, fmt.Errorf("failed to scan game state: %v", err)
		}
		
		if err := json.Unmarshal([]byte(triesJSON), &gameState.Tries); err != nil {
			return []GameState{}, fmt.Errorf("failed to unmarshal tries: %v", err)
		}
		
		gameStates = append(gameStates, gameState)
	}
	
	return gameStates, nil
}

func GetGameStateByID(gameStateID int64) (GameState, error) {
	var gameState GameState
	
	query := `
		SELECT id, target_word, tries, game_status, mode, max_tries, created_at, updated_at
		FROM game_states 
		WHERE id = ?
	`
	
	row := database.DB.QueryRow(query, gameStateID)
	var triesJSON string
	
	err := row.Scan(
		&gameState.ID,
		&gameState.TargetWord,
		&triesJSON,
		&gameState.GameStatus,
		&gameState.Mode,
		&gameState.MaxTries,
		&gameState.CreatedAt,
		&gameState.UpdatedAt,
	)
	if err != nil {
		return GameState{}, fmt.Errorf("failed to load game state: %v", err)
	}
	
	if err := json.Unmarshal([]byte(triesJSON), &gameState.Tries); err != nil {
		return GameState{}, fmt.Errorf("failed to unmarshal tries: %v", err)
	}
	
	return gameState, nil
}

func UpdateGameState(gameState GameState) error {
	existingGameState, err := GetGameStateByID(gameState.ID)
	if err != nil {
		return fmt.Errorf("failed to get existing game state: %v", err)
	}
	
	existingGameState.Tries = append(existingGameState.Tries, gameState.Tries...)
	
	existingGameState.GameStatus = gameState.GameStatus
	existingGameState.UpdatedAt = time.Now()
	
	triesJSON, err := json.Marshal(existingGameState.Tries)
	if err != nil {
		return fmt.Errorf("failed to marshal tries to JSON: %v", err)
	}
	
	query := `
		UPDATE game_states 
		SET tries = ?, game_status = ?, updated_at = ?
		WHERE id = ?
	`
	
	_, err = database.DB.Exec(query, string(triesJSON), existingGameState.GameStatus, existingGameState.UpdatedAt, existingGameState.ID)
	if err != nil {
		return fmt.Errorf("failed to update game state: %v", err)
	}
	
	return nil
}

func ValidateGuess(guessWord string, targetWord string) []LetterResult {
	letterResultArray := make([]LetterResult, len(guessWord))
	
	guessWord = strings.ToUpper(guessWord)
	targetWord = strings.ToUpper(targetWord)
	
	targetLetterCounts := make(map[rune]int)
	for _, letter := range targetWord {
		targetLetterCounts[letter]++
	}
	
	for i, letter := range guessWord {
		if i < len(targetWord) && rune(targetWord[i]) == letter {
			letterResultArray[i] = LetterResult{
				Letter: string(letter),
				Status: "correct",
			}
			targetLetterCounts[letter]--
		}
	}
	
	for i, letter := range guessWord {
		if letterResultArray[i].Status == "" {
			if targetLetterCounts[letter] > 0 {
				letterResultArray[i] = LetterResult{
					Letter: string(letter),
					Status: "incorrect-position",
				}
				targetLetterCounts[letter]--
			} else {
				letterResultArray[i] = LetterResult{
					Letter: string(letter),
					Status: "incorrect",
				}
			}
		}
	}
	
	return letterResultArray
}

func (gs *GameState) DetermineGameStatus(isCorrect bool) string {
	if isCorrect {
		return "won"
	} else {
		if len(gs.Tries)+1 >= gs.MaxTries {
			return "lost"
		} else {
			return gs.GameStatus
		}
	}
}

func (gs *GameState) LeaveGameState() error {
	updatedAt := time.Now()
	
	query := `
		UPDATE game_states 
		SET game_status = ?, updated_at = ?
		WHERE id = ?
	`
	
	_, err := database.DB.Exec(query, "lost", updatedAt, gs.ID)
	if err != nil {
		return fmt.Errorf("failed to leave game state: %v", err)
	}
	
	return nil
}


