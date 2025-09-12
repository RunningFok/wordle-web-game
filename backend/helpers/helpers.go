package helpers

import (
	"database/sql"
	"fmt"
	"math/rand"
	"wordle-backend/data"
	"wordle-backend/database"
)

func GetNextID(tableName string) (int64, error) {
	var maxID sql.NullInt64
	query := fmt.Sprintf("SELECT MAX(id) FROM %s", tableName)
	err := database.DB.QueryRow(query).Scan(&maxID)
	if err != nil {
		return 0, fmt.Errorf("failed to get max ID from %s: %v", tableName, err)
	}
	
	if maxID.Valid {
		return maxID.Int64 + 1, nil
	}
	return 1, nil
}

func GetRandomWord() string {
	return data.WordList[rand.Intn(len(data.WordList))]
}