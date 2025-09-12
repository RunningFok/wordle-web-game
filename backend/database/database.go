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
		panic("Failed to connect to database")
	}

	DB.SetMaxOpenConns(10)
	DB.SetMaxIdleConns(5)

	createTables()
	fmt.Println("Database tables created successfully")
}




func createTables() {

	createGameStatesTable := `
	CREATE TABLE IF NOT EXISTS game_states (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		target_word TEXT NOT NULL,
		tries TEXT,
		game_status TEXT NOT NULL,
		mode TEXT NOT NULL,
		max_tries INTEGER NOT NULL,
		created_at DATETIME NOT NULL,
		updated_at DATETIME NOT NULL
	)
	`

	_, err := DB.Exec(createGameStatesTable)
	if err != nil {
		fmt.Printf("SQL Error creating game_states table: %v\n", err)
		panic("Failed to create game_states table")
	}

}