package routes

import (
	"fmt"
	"net/http"
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
