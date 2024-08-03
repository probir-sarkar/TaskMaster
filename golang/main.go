package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
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

type Task struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	Status  string `json:"status"`
}

// func getTasks() []Task {
// 	var tasks []Task
// 	rows, err := db.Query("SELECT title, content, status FROM tasks")
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	defer rows.Close()
// 	for rows.Next() {
// 		var title, content, status string
// 		if err := rows.Scan(&title, &content, &status); err != nil {
// 			log.Fatal(err)
// 		}
// 		tasks = append(tasks, Task{title, content, status})
// 	}
// 	return tasks
// }

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	// Connect with database
	if err := Connect(); err != nil {
		log.Fatal(err)
	}

	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World")
	})

	app.Get("/tasks", func(c *fiber.Ctx) error {
		rows, err := db.Query("SELECT title, content, status FROM tasks")
		if err != nil {
			return err
		}
		defer rows.Close()

		var tasks []Task
		for rows.Next() {
			var title, content, status string
			if err := rows.Scan(&title, &content, &status); err != nil {
				return err
			}
			tasks = append(tasks, Task{Title: title, Content: content, Status: status})
		}
		return c.JSON(tasks)

	})

	app.Listen(":3000")
}
