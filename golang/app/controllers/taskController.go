package taskController

import (
	"github.com/gofiber/fiber/v2"
	_ "github.com/lib/pq"
)

type Task struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	Status  string `json:"status"`
}

func AddTask(c *fiber.Ctx) error {
	// db := database.GetDB()

	var task Task
	if err := c.BodyParser(&task); err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Review your input", "data": err})
	}
	return c.Status(200).JSON(fiber.Map{"status": "success", "message": "Task created", "data": task})
}
