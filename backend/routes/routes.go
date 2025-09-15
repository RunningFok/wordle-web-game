package routes

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(server *gin.Engine) {
	server.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "message": "Server is running"})
	})
	
	server.POST("/gamestates", createGameState)
	server.GET("/gamestates", getAllGameStates)
	server.GET("/gamestates/:id", getGameStateByID)
	server.PUT("/gamestates", playGameState)
	server.PUT("/gamestates/:id", leaveGameStateByID)
	server.PUT("/gamestates/:id/timeout", timeoutGameStateByID)
}
