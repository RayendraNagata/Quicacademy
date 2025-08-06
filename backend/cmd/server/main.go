package main

import (
	"log"

	"quicacademy-backend/config"
	"quicacademy-backend/routes"
	"quicacademy-backend/utils"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Initialize database
	db, err := utils.InitDB(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Create tables
	if err := utils.CreateTables(db); err != nil {
		log.Fatal("Failed to create tables:", err)
	}

	// Setup routes
	r := routes.SetupRoutes(db, cfg.JWTSecret)

	// Start server
	log.Printf("Server starting on port %s", cfg.Port)
	log.Printf("Environment: %s", cfg.Environment)

	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
