// Game State Routes - RESTful API Endpoints for Game Management
//
// ARCHITECTURE DECISION: RESTful API design with proper HTTP status codes
// - CRUD operations for game state management
// - Comprehensive error handling with meaningful messages
// - Input validation and sanitization
//
// DESIGN PATTERNS USED:
// - RESTful API Pattern: Standard HTTP methods and status codes
// - Error Handling Pattern: Consistent error responses
// - Validation Pattern: Input validation before processing
//
// TRADE-OFFS CONSIDERED:
// - Verbose vs Concise Responses: Detailed responses for better debugging
// - Synchronous vs Asynchronous: Synchronous for simplicity
// - Single vs Multiple Endpoints: Single endpoint for game operations

package routes

import (
	"fmt"
	"net/http"
	"strconv"
	"wordle-backend/helpers"
	"wordle-backend/models"

	"github.com/gin-gonic/gin"
)

// createGameState handles POST /gamestates - Creates a new game session
// BUSINESS LOGIC: Default values provided for optional parameters
// ERROR HANDLING: Graceful fallback to defaults if request parsing fails
func createGameState(context *gin.Context) {
	fmt.Println("Creating wordle")
	
	var request struct {
		MaxTries int `json:"maxTries"`
		WordSize int `json:"wordSize"`
	}
	
	// Default game configuration for optimal gameplay experience
	request.MaxTries = 6  // Standard Wordle configuration
	request.WordSize = 5  // Most common word length
	
	if context.Request.ContentLength > 0 {
		if err := context.ShouldBindJSON(&request); err != nil {
			fmt.Printf("Warning: Failed to parse request body, using defaults: %v\n", err)
		}
	}
	
	gameState, err := models.CreateGameState(request.MaxTries, request.WordSize)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Failed to create game state: " + err.Error()})
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
		"tries": gameState.Tries,
		"gameStatus": gameState.GameStatus,
		"mode": gameState.Mode,
		"maxTries": gameState.MaxTries,
		"wordSize": gameState.WordSize,
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

// playGameState handles PUT /gamestates - Processes a guess in an active game
// CORE GAME LOGIC: Validates guess, updates game state, determines win/loss
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

	// Word validation against curated word lists
	// BUSINESS RULE: Only valid words from approved lists are accepted
	fmt.Printf("Validating word: %s\n", updateRequest.GuessWord)
	if !helpers.IsWordInList(updateRequest.GuessWord) {
		fmt.Printf("Word validation failed for: %s\n", updateRequest.GuessWord)
		// Return specific error with invalid word for frontend handling
		context.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid word: " + updateRequest.GuessWord + " is not a valid word", 
			"invalid_guess_word": updateRequest.GuessWord,
		})
		return
	}
	fmt.Printf("Word validation passed for: %s\n", updateRequest.GuessWord)
	
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
	
	response := gin.H{
		"message": "Game state updated successfully",
		"id": updatedGameState.ID,
		"tries": updatedGameState.Tries,
		"gameStatus": updatedGameState.GameStatus,
		"mode": updatedGameState.Mode,
		"maxTries": updatedGameState.MaxTries,
		"wordSize": updatedGameState.WordSize,
		"updatedAt": updatedGameState.UpdatedAt,
		"createdAt": updatedGameState.CreatedAt,
	}
	
	if updatedGameState.GameStatus == "won" || updatedGameState.GameStatus == "lost" {
		response["targetWord"] = updatedGameState.TargetWord
	}
	
	context.JSON(http.StatusOK, response)
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

func timeoutGameStateByID(context *gin.Context) {
	fmt.Println("Setting game state status to lose")
	
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
	
	err = gameState.TimeoutGameState()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set game state status to timeout: " + err.Error()})
		return
	}
	
	updatedGameState, err := models.GetGameStateByID(gameStateID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get updated game state: " + err.Error()})
		return
	}
	
	context.JSON(http.StatusOK, gin.H{
		"message": "Game state status set to lost successfully",
		"id": updatedGameState.ID,
		"targetWord": updatedGameState.TargetWord,
		"gameStatus": updatedGameState.GameStatus,
		"mode": updatedGameState.Mode,
		"maxTries": updatedGameState.MaxTries,
		"wordSize": updatedGameState.WordSize,
		"updatedAt": updatedGameState.UpdatedAt,
		"createdAt": updatedGameState.CreatedAt,
	})
}