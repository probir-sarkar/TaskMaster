package database

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

// Database instance
var db *sql.DB

// Connect function
func Connect() error {
	var err error
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		return fmt.Errorf("DATABASE_URL is not set")
	}
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		return err
	}
	if err = db.Ping(); err != nil {
		return err
	}
	return nil
}

// Get DB
func GetDB() *sql.DB {
	return db
}
