package main

import (
	"fmt"
	"wordle-backend/database"
	"wordle-backend/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("Starting server...")
	database.InitDB()
	fmt.Println("Database initialized successfully")
	
	router := gin.Default()
	
	routes.RegisterRoutes(router)
	
	router.Run(":8080")
}