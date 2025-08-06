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

type QuizController struct {
	DB        *sql.DB
	AIService *services.OpenRouterService
}

type Question struct {
	ID            int      `json:"id"`
	Type          string   `json:"type"`
	Question      string   `json:"question"`
	Options       []string `json:"options,omitempty"`
	CorrectAnswer string   `json:"correct_answer"`
	Explanation   string   `json:"explanation"`
	Difficulty    string   `json:"difficulty"`
}

type QuizSubmission struct {
	Answers   map[string]string `json:"answers"`
	TimeSpent int               `json:"time_spent"`
}

func NewQuizController(db *sql.DB) *QuizController {
	return &QuizController{
		DB:        db,
		AIService: services.NewOpenRouterService(),
	}
}

func (qc *QuizController) GenerateQuiz(c *gin.Context) {
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
	query := `SELECT id, title, subject, extracted_text FROM materials WHERE id = $1 AND user_id = $2`
	err := qc.DB.QueryRow(query, materialID, userID).Scan(
		&material.ID, &material.Title, &material.Subject, &material.ExtractedText,
	)

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

	// Check if quiz already exists
	var existingQuiz models.Quiz
	quizQuery := `SELECT id, title, questions, time_limit, passing_score FROM quizzes WHERE material_id = $1`
	err = qc.DB.QueryRow(quizQuery, materialID).Scan(
		&existingQuiz.ID, &existingQuiz.Title, &existingQuiz.Questions,
		&existingQuiz.TimeLimit, &existingQuiz.PassingScore,
	)

	if err == nil {
		// Quiz exists, return it
		var questions []Question
		json.Unmarshal([]byte(existingQuiz.Questions), &questions)

		c.JSON(http.StatusOK, gin.H{
			"quiz": gin.H{
				"id":            existingQuiz.ID,
				"title":         existingQuiz.Title,
				"time_limit":    existingQuiz.TimeLimit,
				"passing_score": existingQuiz.PassingScore,
				"questions":     questions,
			},
			"material": gin.H{
				"id":      material.ID,
				"title":   material.Title,
				"subject": material.Subject,
			},
		})
		return
	}

	// Generate new quiz using AI
	questionsJSON, err := qc.AIService.GenerateQuiz(material.ExtractedText, material.Subject)
	if err != nil {
		// Fallback to mock if AI fails
		questions := qc.generateAIQuestions(material.ExtractedText, material.Subject)
		questionsJSON, _ = json.Marshal(questions)
	}

	// Save quiz to database
	newQuiz := models.Quiz{
		ID:           uuid.New(),
		MaterialID:   material.ID,
		Title:        "Quiz: " + material.Title,
		Questions:    string(questionsJSON),
		TimeLimit:    1800, // 30 minutes
		PassingScore: 70,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	insertQuery := `INSERT INTO quizzes (id, material_id, title, questions, time_limit, passing_score, created_at, updated_at)
					VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`

	_, err = qc.DB.Exec(insertQuery,
		newQuiz.ID, newQuiz.MaterialID, newQuiz.Title, newQuiz.Questions,
		newQuiz.TimeLimit, newQuiz.PassingScore, newQuiz.CreatedAt, newQuiz.UpdatedAt,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save quiz"})
		return
	}

	// Parse questions for response
	var parsedQuestions []Question
	json.Unmarshal(questionsJSON, &parsedQuestions)

	c.JSON(http.StatusCreated, gin.H{
		"quiz": gin.H{
			"id":            newQuiz.ID,
			"title":         newQuiz.Title,
			"time_limit":    newQuiz.TimeLimit,
			"passing_score": newQuiz.PassingScore,
			"questions":     parsedQuestions,
		},
		"material": gin.H{
			"id":      material.ID,
			"title":   material.Title,
			"subject": material.Subject,
		},
	})
}

func (qc *QuizController) GetQuiz(c *gin.Context) {
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

	// Get quiz and verify material belongs to user
	query := `SELECT q.id, q.title, q.questions, q.time_limit, q.passing_score,
					 m.title, m.subject
			  FROM quizzes q
			  JOIN materials m ON q.material_id = m.id
			  WHERE m.id = $1 AND m.user_id = $2`

	var quiz models.Quiz
	var materialTitle, materialSubject string

	err := qc.DB.QueryRow(query, materialID, userID).Scan(
		&quiz.ID, &quiz.Title, &quiz.Questions, &quiz.TimeLimit, &quiz.PassingScore,
		&materialTitle, &materialSubject,
	)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Quiz not found"})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	var questions []Question
	json.Unmarshal([]byte(quiz.Questions), &questions)

	c.JSON(http.StatusOK, gin.H{
		"quiz": gin.H{
			"id":            quiz.ID,
			"title":         quiz.Title,
			"time_limit":    quiz.TimeLimit,
			"passing_score": quiz.PassingScore,
			"questions":     questions,
		},
		"material": gin.H{
			"id":      materialID,
			"title":   materialTitle,
			"subject": materialSubject,
		},
	})
}

func (qc *QuizController) SubmitQuiz(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	quizID := c.Param("id")
	if quizID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Quiz ID required"})
		return
	}

	var submission QuizSubmission
	if err := c.ShouldBindJSON(&submission); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get quiz questions
	var quiz models.Quiz
	query := `SELECT questions, passing_score FROM quizzes WHERE id = $1`
	err := qc.DB.QueryRow(query, quizID).Scan(&quiz.Questions, &quiz.PassingScore)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Quiz not found"})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Calculate score
	var questions []Question
	json.Unmarshal([]byte(quiz.Questions), &questions)

	correct := 0
	total := len(questions)

	for _, question := range questions {
		if answer, exists := submission.Answers[string(rune(question.ID))]; exists {
			if answer == question.CorrectAnswer {
				correct++
			}
		}
	}

	score := int((float64(correct) / float64(total)) * 100)
	passed := score >= quiz.PassingScore

	// Save quiz attempt
	attempt := models.QuizAttempt{
		ID:        uuid.New(),
		UserID:    userID.(uuid.UUID),
		QuizID:    uuid.MustParse(quizID),
		Score:     score,
		TimeSpent: submission.TimeSpent,
		Passed:    passed,
		CreatedAt: time.Now(),
	}

	answersJSON, _ := json.Marshal(submission.Answers)
	attempt.Answers = string(answersJSON)

	insertQuery := `INSERT INTO quiz_attempts (id, user_id, quiz_id, answers, score, time_spent, passed, created_at)
					VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`

	_, err = qc.DB.Exec(insertQuery,
		attempt.ID, attempt.UserID, attempt.QuizID, attempt.Answers,
		attempt.Score, attempt.TimeSpent, attempt.Passed, attempt.CreatedAt,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save quiz attempt"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"score":         score,
		"correct":       correct,
		"total":         total,
		"passed":        passed,
		"passing_score": quiz.PassingScore,
		"attempt_id":    attempt.ID,
	})
}

// Mock AI question generation
func (qc *QuizController) generateAIQuestions(text, subject string) []Question {
	// This is a mock implementation
	// In production, this would call OpenRouter API

	return []Question{
		{
			ID:       1,
			Type:     "multiple_choice",
			Question: "Apa konsep utama yang dibahas dalam materi ini?",
			Options: []string{
				"Konsep A yang mendasar",
				"Konsep B yang kompleks",
				"Konsep C yang aplikatif",
				"Konsep D yang teoritis",
			},
			CorrectAnswer: "Konsep A yang mendasar",
			Explanation:   "Konsep A adalah fondasi utama yang harus dipahami sebelum mempelajari konsep lainnya.",
			Difficulty:    "easy",
		},
		{
			ID:            2,
			Type:          "true_false",
			Question:      "Apakah materi ini memiliki aplikasi praktis dalam kehidupan sehari-hari?",
			CorrectAnswer: "true",
			Explanation:   "Ya, materi ini memiliki banyak aplikasi praktis yang dapat diterapkan dalam berbagai situasi.",
			Difficulty:    "easy",
		},
		{
			ID:       3,
			Type:     "multiple_choice",
			Question: "Manakah yang merupakan karakteristik utama dari topik ini?",
			Options: []string{
				"Bersifat statis dan tidak berubah",
				"Dinamis dan dapat berkembang",
				"Hanya berlaku dalam kondisi tertentu",
				"Tidak memiliki hubungan dengan bidang lain",
			},
			CorrectAnswer: "Dinamis dan dapat berkembang",
			Explanation:   "Topik ini bersifat dinamis karena terus berkembang seiring dengan kemajuan penelitian dan aplikasi.",
			Difficulty:    "medium",
		},
	}
}
