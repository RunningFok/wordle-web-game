package routes

import (
	"fmt"
	"net/http"
	"strconv"
	"wordle-backend/models"

	"github.com/gin-gonic/gin"
)

func createGameState(context *gin.Context) {
	fmt.Println("Creating wordle")
	
	gameState, err := models.CreateGameState()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create game state: " + err.Error()})
		return
	}
	
	err = models.SaveGameState(gameState)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save game state: " + err.Error()})
		return
	}
	
	fmt.Printf("Game state created with ID: %d, Target Word: %s\n", gameState.ID, gameState.TargetWord)
	
	context.JSON(http.StatusCreated, gin.H{
		"message": "Game state created successfully",
		"id": gameState.ID,
		"targetWord": gameState.TargetWord,
		"tries": gameState.Tries,
		"gameStatus": gameState.GameStatus,
		"mode": gameState.Mode,
		"maxTries": gameState.MaxTries,
		"updatedAt": gameState.UpdatedAt,
		"createdAt": gameState.CreatedAt,
	})
}

func getAllGameStates(context *gin.Context) {
	fmt.Println("Getting all game states")
	
	gameStates, err := models.GetAllGameStates()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get game states: " + err.Error()})
		return
	}
	
	context.JSON(http.StatusOK, gameStates)
}

func getGameStateByID(context *gin.Context) {
	fmt.Println("Getting game state by ID")
	
	gameStateID, err := strconv.ParseInt(context.Param("id"), 10, 64)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid game state ID"})
		return
	}
	gameState, err := models.GetGameStateByID(gameStateID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get game state by ID: " + err.Error()})
		return
	}
	
	context.JSON(http.StatusOK, gameState)
}

func playGameState(context *gin.Context) {
	fmt.Println("Updating game state")
	
	var updateRequest struct {
		ID        int64  `json:"id"`
		GuessWord string `json:"guessWord"`
	}
	
	if err := context.ShouldBindJSON(&updateRequest); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body: " + err.Error()})
		return
	}
	
	if updateRequest.ID == 0 {
		context.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
		return
	}
	
	if updateRequest.GuessWord == "" {
		context.JSON(http.StatusBadRequest, gin.H{"error": "guessWord is required"})
		return
	}
	
	existingGameState, err := models.GetGameStateByID(updateRequest.ID)
	if err != nil {
		context.JSON(http.StatusNotFound, gin.H{"error": "Game state not found"})
		return
	}
	
	letterResultArray := models.ValidateGuess(updateRequest.GuessWord, existingGameState.TargetWord)
	
	validatedGuess := models.GuessResult{
		GuessWord: updateRequest.GuessWord,
		LetterResultArray:   letterResultArray,
		IsCorrect: updateRequest.GuessWord == existingGameState.TargetWord,
	}
	
	newGameStatus := existingGameState.DetermineGameStatus(validatedGuess.IsCorrect)
	
	updateGameState := models.GameState{
		ID:         updateRequest.ID,
		Tries:      []models.GuessResult{validatedGuess},
		GameStatus: newGameStatus,
	}
	
	err = models.UpdateGameState(updateGameState)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update game state: " + err.Error()})
		return
	}
	
	updatedGameState, err := models.GetGameStateByID(updateRequest.ID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get updated game state: " + err.Error()})
		return
	}
	
	fmt.Printf("Game state updated with ID: %d\n", updatedGameState.ID)
	
	context.JSON(http.StatusOK, gin.H{
		"message": "Game state updated successfully",
		"id": updatedGameState.ID,
		"targetWord": updatedGameState.TargetWord,
		"tries": updatedGameState.Tries,
		"gameStatus": updatedGameState.GameStatus,
		"mode": updatedGameState.Mode,
		"maxTries": updatedGameState.MaxTries,
		"updatedAt": updatedGameState.UpdatedAt,
		"createdAt": updatedGameState.CreatedAt,
	})
}

func leaveGameStateByID(context *gin.Context) {
	fmt.Println("Leaving game state")
	
	gameStateID, err := strconv.ParseInt(context.Param("id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid game state ID"})
		return
	}
	
	gameState, err := models.GetGameStateByID(gameStateID)
	if err != nil {
		context.JSON(http.StatusNotFound, gin.H{"error": "Game state not found"})
		return
	}
	
	err = gameState.LeaveGameState()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to leave game state: " + err.Error()})
		return
	}
	
	context.JSON(http.StatusOK, gin.H{"message": "Player left the game state successfully"})
}