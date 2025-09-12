package routes

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(server *gin.Engine) {
	server.POST("/gamestates", createGameState)
	server.GET("/gamestates", getAllGameStates)
	server.GET("/gamestates/:id", getGameStateByID)
	server.PUT("/gamestates", playGameState)
}
