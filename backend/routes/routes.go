package routes

import (
	"database/sql"

	"quicacademy-backend/controllers"
	"quicacademy-backend/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(db *sql.DB, jwtSecret string) *gin.Engine {
	r := gin.Default()

	// CORS middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "http://localhost:3001"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	// Initialize controllers
	authController := controllers.NewAuthController(db, jwtSecret)
	uploadController := controllers.NewUploadController(db)
	summaryController := controllers.NewSummaryController(db)
	quizController := controllers.NewQuizController(db)
	assistantController := controllers.NewAssistantController(db)

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "message": "Quicacademy API is running"})
	})

	// API routes
	api := r.Group("/api/v1")
	{
		// Public routes (no authentication required)
		auth := api.Group("/auth")
		{
			auth.POST("/register", authController.Register)
			auth.POST("/login", authController.Login)
		}

		// Protected routes (authentication required)
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware(jwtSecret))
		{
			// User profile
			protected.GET("/profile", authController.GetProfile)

			// Materials
			materials := protected.Group("/materials")
			{
				materials.POST("/upload", uploadController.UploadFile)
				materials.GET("/", uploadController.GetMaterials)
				materials.GET("/:id", uploadController.GetMaterial)
			}

			// Summaries
			summaries := protected.Group("/summaries")
			{
				summaries.POST("/generate/:id", summaryController.GenerateSummary)
				summaries.GET("/:id", summaryController.GetSummary)
			}

			// Quizzes
			quizzes := protected.Group("/quizzes")
			{
				quizzes.POST("/generate/:id", quizController.GenerateQuiz)
				quizzes.GET("/:id", quizController.GetQuiz)
				quizzes.POST("/submit/:id", quizController.SubmitQuiz)
			}

			// AI Assistant
			assistant := protected.Group("/assistant")
			{
				assistant.POST("/chat", assistantController.Chat)
			}
		}
	}

	return r
}
