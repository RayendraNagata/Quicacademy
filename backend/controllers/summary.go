package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"quicacademy-backend/models"
	"quicacademy-backend/services"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type SummaryController struct {
	DB        *sql.DB
	AIService *services.OpenRouterService
}

func NewSummaryController(db *sql.DB) *SummaryController {
	return &SummaryController{
		DB:        db,
		AIService: services.NewOpenRouterService(),
	}
}

func (sc *SummaryController) GenerateSummary(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	materialID := c.Param("id")
	if materialID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Material ID required"})
		return
	}

	// Check if material exists and belongs to user
	var material models.Material
	query := `SELECT id, title, extracted_text FROM materials WHERE id = $1 AND user_id = $2`
	err := sc.DB.QueryRow(query, materialID, userID).Scan(&material.ID, &material.Title, &material.ExtractedText)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Material not found"})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if material.ExtractedText == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Material has not been processed yet"})
		return
	}

	// Check if summary already exists
	var existingSummary models.Summary
	summaryQuery := `SELECT id, bullet_points, paragraphs, concepts FROM summaries WHERE material_id = $1`
	err = sc.DB.QueryRow(summaryQuery, materialID).Scan(
		&existingSummary.ID, &existingSummary.BulletPoints,
		&existingSummary.Paragraphs, &existingSummary.Concepts,
	)

	if err == nil {
		// Summary exists, return it
		c.JSON(http.StatusOK, gin.H{
			"summary": existingSummary,
			"material": gin.H{
				"id":    material.ID,
				"title": material.Title,
			},
		})
		return
	}

	// Generate new summary using AI
	bulletPoints, paragraphs, concepts, err := sc.AIService.GenerateSummary(material.ExtractedText)
	if err != nil {
		// Fallback to mock if AI fails
		bulletPoints, paragraphs, concepts = sc.generateAISummary(material.ExtractedText)
	}

	// Save summary to database
	newSummary := models.Summary{
		ID:           uuid.New(),
		MaterialID:   material.ID,
		BulletPoints: bulletPoints,
		Paragraphs:   paragraphs,
		Concepts:     concepts,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	insertQuery := `INSERT INTO summaries (id, material_id, bullet_points, paragraphs, concepts, created_at, updated_at)
					VALUES ($1, $2, $3, $4, $5, $6, $7)`

	_, err = sc.DB.Exec(insertQuery,
		newSummary.ID, newSummary.MaterialID, newSummary.BulletPoints,
		newSummary.Paragraphs, newSummary.Concepts, newSummary.CreatedAt, newSummary.UpdatedAt,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save summary"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"summary": newSummary,
		"material": gin.H{
			"id":    material.ID,
			"title": material.Title,
		},
	})
}

func (sc *SummaryController) GetSummary(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	materialID := c.Param("id")
	if materialID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Material ID required"})
		return
	}

	// Verify material belongs to user and get summary
	query := `SELECT s.id, s.bullet_points, s.paragraphs, s.concepts, s.created_at, s.updated_at,
					 m.title, m.subject
			  FROM summaries s
			  JOIN materials m ON s.material_id = m.id
			  WHERE m.id = $1 AND m.user_id = $2`

	var summary models.Summary
	var materialTitle, materialSubject string

	err := sc.DB.QueryRow(query, materialID, userID).Scan(
		&summary.ID, &summary.BulletPoints, &summary.Paragraphs, &summary.Concepts,
		&summary.CreatedAt, &summary.UpdatedAt, &materialTitle, &materialSubject,
	)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Summary not found"})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"summary": summary,
		"material": gin.H{
			"id":      materialID,
			"title":   materialTitle,
			"subject": materialSubject,
		},
	})
}

// Mock AI summary generation
func (sc *SummaryController) generateAISummary(text string) (string, string, string) {
	// This is a mock implementation
	// In production, this would call OpenRouter API

	bulletPoints := `• Konsep fundamental dalam topik ini
• Definisi dan karakteristik utama
• Aplikasi praktis dalam kehidupan sehari-hari
• Hubungan dengan konsep lain yang terkait
• Metode dan teknik yang digunakan
• Contoh konkret dan studi kasus`

	paragraphs := `Materi ini membahas konsep-konsep fundamental yang sangat penting untuk dipahami. 
Pembahasan dimulai dengan definisi dasar dan karakteristik utama yang membedakan topik ini dari yang lain.

Aplikasi praktis dari konsep ini dapat ditemukan dalam berbagai aspek kehidupan sehari-hari, 
memberikan relevansi yang tinggi bagi pembelajaran. Hubungan dengan konsep lain menunjukkan 
bagaimana topik ini terintegrasi dalam sistem pengetahuan yang lebih luas.

Metode dan teknik yang dibahas memberikan pendekatan praktis untuk memahami dan menerapkan konsep. 
Contoh konkret dan studi kasus membantu memperkuat pemahaman melalui ilustrasi yang nyata.`

	conceptsData := []map[string]string{
		{
			"title":       "Konsep Dasar",
			"description": "Fondasi pemahaman yang harus dikuasai terlebih dahulu",
		},
		{
			"title":       "Prinsip Utama",
			"description": "Aturan-aturan fundamental yang mengatur topik ini",
		},
		{
			"title":       "Aplikasi Praktis",
			"description": "Cara menerapkan konsep dalam situasi nyata",
		},
		{
			"title":       "Hubungan Antar Konsep",
			"description": "Keterkaitan dengan topik lain dalam bidang yang sama",
		},
	}

	conceptsJSON, _ := json.Marshal(conceptsData)

	return bulletPoints, paragraphs, string(conceptsJSON)
}
