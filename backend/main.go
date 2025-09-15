package main

import (
	"fmt"
	"os"
	"wordle-backend/database"
	"wordle-backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	apiUrl := os.Getenv("API_URL")
	if apiUrl == "" {
		apiUrl = "http://localhost:3000"
	}
	
	fmt.Println("Starting server...")
	database.InitDB()
	fmt.Println("Database initialized successfully")
	
	router := gin.Default()
	
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"}
	config.AllowCredentials = false
	router.Use(cors.New(config))
	
	routes.RegisterRoutes(router)
	
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok", 
			"message": "Wordle Backend API is running",
			"api_url": apiUrl,
		})
	})
	
	fmt.Printf("Server starting on port %s\n", port)
	router.Run(":" + port)
}