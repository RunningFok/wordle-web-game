// Wordle Web Game Backend API
//
// ARCHITECTURE DECISION: Microservice approach with clear separation of concerns
// - RESTful API design following OpenAPI standards
// - SQLite for simplicity in development (easily upgradeable to PostgreSQL/MySQL)
// - Gin framework for high-performance HTTP routing
// - CORS enabled for frontend integration
//
// TRADE-OFFS CONSIDERED:
//   - SQLite vs PostgreSQL: Chose SQLite for zero-config setup, easy deployment
//     Production would use PostgreSQL for concurrent access and ACID guarantees
//   - In-memory vs Database: Database chosen for persistence and multi-user support
//   - JSON vs Binary: JSON for API responses for debugging and frontend compatibility
//
// SCALABILITY CONSIDERATIONS:
// - Connection pooling configured (MaxOpenConns: 10, MaxIdleConns: 5)
// - Stateless design allows horizontal scaling
// - Environment-based configuration for different deployment stages
package main

import (
	"fmt"
	"os"
	"wordle-backend/database"
	"wordle-backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// main initializes the Wordle backend server with proper configuration
// and middleware setup for production-ready deployment
func main() {
	// Environment-based configuration for flexible deployment
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