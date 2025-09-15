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
	config.AllowOrigins = []string{apiUrl, "http://localhost:3000", "http://127.0.0.1:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept"}
	router.Use(cors.New(config))
	
	routes.RegisterRoutes(router)
	
	
	fmt.Printf("Server starting on port %s\n", port)
	
	addr := "0.0.0.0:" + port
	fmt.Printf("Binding to address: %s\n", addr)
	
	if err := router.Run(addr); err != nil {
		fmt.Printf("Failed to start server: %v\n", err)
		os.Exit(1)
	}
}