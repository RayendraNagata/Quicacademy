package controllers

import (
	"database/sql"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"quicacademy-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UploadController struct {
	DB *sql.DB
}

func NewUploadController(db *sql.DB) *UploadController {
	return &UploadController{DB: db}
}

func (uc *UploadController) UploadFile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Parse multipart form
	err := c.Request.ParseMultipartForm(10 << 20) // 10 MB max
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form"})
		return
	}

	file, fileHeader, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}
	defer file.Close()

	// Validate file type
	allowedTypes := map[string]bool{
		".pdf":  true,
		".jpg":  true,
		".jpeg": true,
		".png":  true,
	}

	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
	if !allowedTypes[ext] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File type not supported"})
		return
	}

	// Validate file size (10MB max)
	if fileHeader.Size > 10<<20 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File size too large"})
		return
	}

	// Get metadata from form
	title := c.PostForm("title")
	subject := c.PostForm("subject")
	
	if title == "" {
		title = strings.TrimSuffix(fileHeader.Filename, ext)
	}
	if subject == "" {
		subject = "General"
	}

	// Create uploads directory if not exists
	uploadDir := "./uploads"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory"})
		return
	}

	// Generate unique filename
	materialID := uuid.New()
	fileName := fmt.Sprintf("%s_%s", materialID.String(), fileHeader.Filename)
	filePath := filepath.Join(uploadDir, fileName)

	// Save file
	dst, err := os.Create(filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create file"})
		return
	}
	defer dst.Close()

	if _, err = io.Copy(dst, file); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// Create material record
	material := models.Material{
		ID:        materialID,
		UserID:    userID.(uuid.UUID),
		Title:     title,
		Subject:   subject,
		FileName:  fileHeader.Filename,
		FileURL:   filePath,
		FileSize:  fileHeader.Size,
		FileType:  ext,
		Status:    "uploading",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	query := `INSERT INTO materials (id, user_id, title, subject, file_name, file_url, file_size, file_type, status, created_at, updated_at)
			  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`

	_, err = uc.DB.Exec(query, 
		material.ID, material.UserID, material.Title, material.Subject,
		material.FileName, material.FileURL, material.FileSize, material.FileType,
		material.Status, material.CreatedAt, material.UpdatedAt,
	)

	if err != nil {
		// Clean up file if database insert fails
		os.Remove(filePath)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save material record"})
		return
	}

	// TODO: Trigger background processing for text extraction and AI analysis
	go uc.processFile(material)

	response := models.UploadResponse{
		Material: material,
		Message:  "File uploaded successfully",
	}

	c.JSON(http.StatusCreated, response)
}

func (uc *UploadController) GetMaterials(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	query := `SELECT id, user_id, title, subject, file_name, file_url, file_size, file_type, status, word_count, created_at, updated_at
			  FROM materials WHERE user_id = $1 ORDER BY created_at DESC`

	rows, err := uc.DB.Query(query, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var materials []models.Material
	for rows.Next() {
		var material models.Material
		err := rows.Scan(
			&material.ID, &material.UserID, &material.Title, &material.Subject,
			&material.FileName, &material.FileURL, &material.FileSize, &material.FileType,
			&material.Status, &material.WordCount, &material.CreatedAt, &material.UpdatedAt,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan material"})
			return
		}
		materials = append(materials, material)
	}

	c.JSON(http.StatusOK, gin.H{"materials": materials})
}

func (uc *UploadController) GetMaterial(c *gin.Context) {
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

	var material models.Material
	query := `SELECT id, user_id, title, subject, file_name, file_url, file_size, file_type, status, extracted_text, word_count, created_at, updated_at
			  FROM materials WHERE id = $1 AND user_id = $2`

	err := uc.DB.QueryRow(query, materialID, userID).Scan(
		&material.ID, &material.UserID, &material.Title, &material.Subject,
		&material.FileName, &material.FileURL, &material.FileSize, &material.FileType,
		&material.Status, &material.ExtractedText, &material.WordCount,
		&material.CreatedAt, &material.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Material not found"})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, material)
}

// Background processing function (placeholder)
func (uc *UploadController) processFile(material models.Material) {
	// TODO: Implement actual text extraction and AI processing
	// For now, just update status to completed after a delay
	time.Sleep(5 * time.Second)
	
	// Simulate text extraction
	extractedText := "Sample extracted text from " + material.FileName
	wordCount := len(strings.Fields(extractedText))
	
	query := `UPDATE materials SET status = $1, extracted_text = $2, word_count = $3, updated_at = $4 WHERE id = $5`
	_, err := uc.DB.Exec(query, "completed", extractedText, wordCount, time.Now(), material.ID)
	if err != nil {
		fmt.Printf("Failed to update material status: %v\n", err)
	}
}
