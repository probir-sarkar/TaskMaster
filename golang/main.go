package main

import (
	"log"

	routes "TaskMasterAPI/app"
	database "TaskMasterAPI/config"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	// Connect with database
	if err := database.Connect(); err != nil {
		log.Fatal(err)
	}

	app := fiber.New()

	routes.Routes(app)

	app.Listen(":3000")
}
