// Database Layer - SQLite Database Management and Connection Pooling
//
// ARCHITECTURE DECISION: SQLite for development simplicity with connection pooling
// - Zero-configuration database setup for easy deployment
// - Connection pooling for optimal performance
// - Automatic table creation on startup
//
// DESIGN PATTERNS USED:
// - Singleton Pattern: Single database connection instance
// - Factory Pattern: Database initialization with proper configuration
//
// TRADE-OFFS CONSIDERED:
// - SQLite vs PostgreSQL: SQLite chosen for simplicity, easily upgradeable
// - Connection Pooling: Configured for optimal performance vs resource usage
// - Auto-migration: Simple table creation vs complex migration system
//
// PRODUCTION CONSIDERATIONS:
// - Connection limits configured for expected load
// - Error handling with panic for critical failures
// - Easy migration path to PostgreSQL for production scaling
package database

import (
	"database/sql"
	"fmt"

	_ "modernc.org/sqlite"
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("sqlite", "api.db")
	
	if err != nil {
		fmt.Printf("Error connecting to database: %v\n", err)
		// Critical failure, stop application
		panic("Failed to connect to database") 
	}

	// MaxOpenConns: Maximum number of open connections to the database
	// MaxIdleConns: Maximum number of connections in the idle connection pool
	DB.SetMaxOpenConns(10)
	DB.SetMaxIdleConns(5)

	// Initialize database schema
	createTables()
	fmt.Println("Database tables created successfully")
}




// createTables initializes the database schema
// DESIGN DECISION: Simple table structure with JSON storage for flexibility
// TRADE-OFF: JSON storage vs normalized tables - JSON chosen for simplicity
func createTables() {
	// Game states table with comprehensive game information
	// DESIGN: JSON storage for tries array allows flexible game state evolution
	createGameStatesTable := `
	CREATE TABLE IF NOT EXISTS game_states (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		target_word TEXT NOT NULL,
		tries TEXT,
		game_status TEXT NOT NULL,
		mode TEXT NOT NULL,
		max_tries INTEGER NOT NULL,
		word_size INTEGER NOT NULL DEFAULT 5,
		created_at DATETIME NOT NULL,
		updated_at DATETIME NOT NULL
	)
	`

	_, err := DB.Exec(createGameStatesTable)
	if err != nil {
		fmt.Printf("SQL Error creating game_states table: %v\n", err)
		panic("Failed to create game_states table") // Critical failure
	}

}