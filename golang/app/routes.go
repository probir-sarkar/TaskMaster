package routes

import (
	taskController "TaskMasterAPI/app/controllers"
	database "TaskMasterAPI/config"
	"log"

	"github.com/gofiber/fiber/v2"
	_ "github.com/lib/pq"
)

type Task struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	Status  string `json:"status"`
}

func Routes(app *fiber.App) {

	// Use the database instance from the database package
	db := database.GetDB()
	if db == nil {
		log.Fatalf("Database connection is nil")
	}

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

	app.Post("/tasks", taskController.AddTask)
}
