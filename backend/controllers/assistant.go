package controllers

import (
	"database/sql"
	"net/http"

	"quicacademy-backend/services"

	"github.com/gin-gonic/gin"
)

type AssistantController struct {
	DB        *sql.DB
	AIService *services.OpenRouterService
}

type ChatRequest struct {
	Message    string `json:"message" validate:"required"`
	MaterialID string `json:"material_id,omitempty"`
}

type ChatResponse struct {
	Response string `json:"response"`
}

func NewAssistantController(db *sql.DB) *AssistantController {
	return &AssistantController{
		DB:        db,
		AIService: services.NewOpenRouterService(),
	}
}

func (ac *AssistantController) Chat(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get material context if provided
	context := ""
	if req.MaterialID != "" {
		var extractedText string
		query := `SELECT extracted_text FROM materials WHERE id = $1 AND user_id = $2`
		err := ac.DB.QueryRow(query, req.MaterialID, userID).Scan(&extractedText)
		if err == nil {
			context = extractedText
		}
	}

	// Generate AI response
	response, err := ac.AIService.ChatAssistant(req.Message, context)
	if err != nil {
		// Fallback response if AI fails
		response = ac.generateFallbackResponse(req.Message)
	}

	c.JSON(http.StatusOK, ChatResponse{
		Response: response,
	})
}

func (ac *AssistantController) generateFallbackResponse(message string) string {
	fallbackResponses := map[string]string{
		"halo":    "Halo! Saya AI Assistant Quicacademy. Ada yang bisa saya bantu?",
		"bantuan": "Saya bisa membantu Anda memahami materi pembelajaran. Tanyakan konsep yang ingin dipahami!",
		"terima":  "Sama-sama! Senang bisa membantu belajar Anda.",
		"default": "Maaf, saya sedang mengalami gangguan. Silakan coba lagi nanti atau tanyakan pertanyaan yang lebih spesifik.",
	}

	// Simple keyword matching
	for keyword, response := range fallbackResponses {
		if keyword != "default" && len(message) > 0 {
			for _, char := range message {
				if string(char) == keyword[:1] {
					return response
				}
			}
		}
	}

	return fallbackResponses["default"]
}
