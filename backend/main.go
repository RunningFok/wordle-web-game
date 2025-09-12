package main

import (
	"fmt"
	"wordle-backend/database"
)

func main() {
	fmt.Println("Starting server...")
	database.InitDB()
	fmt.Println("Database initialized successfully")
}