package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID        uuid.UUID `json:"id" db:"id"`
	Name      string    `json:"name" db:"name" validate:"required,min=2,max=100"`
	Email     string    `json:"email" db:"email" validate:"required,email"`
	Password  string    `json:"-" db:"password_hash" validate:"required,min=6"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

type Material struct {
	ID           uuid.UUID `json:"id" db:"id"`
	UserID       uuid.UUID `json:"user_id" db:"user_id"`
	Title        string    `json:"title" db:"title" validate:"required,min=1,max=200"`
	Subject      string    `json:"subject" db:"subject" validate:"required,min=1,max=100"`
	FileName     string    `json:"file_name" db:"file_name"`
	FileURL      string    `json:"file_url" db:"file_url"`
	FileSize     int64     `json:"file_size" db:"file_size"`
	FileType     string    `json:"file_type" db:"file_type"`
	Status       string    `json:"status" db:"status"` // uploading, processing, completed, error
	ExtractedText string   `json:"extracted_text" db:"extracted_text"`
	WordCount    int       `json:"word_count" db:"word_count"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

type Summary struct {
	ID           uuid.UUID `json:"id" db:"id"`
	MaterialID   uuid.UUID `json:"material_id" db:"material_id"`
	BulletPoints string    `json:"bullet_points" db:"bullet_points"`
	Paragraphs   string    `json:"paragraphs" db:"paragraphs"`
	Concepts     string    `json:"concepts" db:"concepts"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

type Quiz struct {
	ID          uuid.UUID `json:"id" db:"id"`
	MaterialID  uuid.UUID `json:"material_id" db:"material_id"`
	Title       string    `json:"title" db:"title"`
	Questions   string    `json:"questions" db:"questions"` // JSON array of questions
	TimeLimit   int       `json:"time_limit" db:"time_limit"` // in seconds
	PassingScore int      `json:"passing_score" db:"passing_score"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

type QuizAttempt struct {
	ID        uuid.UUID `json:"id" db:"id"`
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	QuizID    uuid.UUID `json:"quiz_id" db:"quiz_id"`
	Answers   string    `json:"answers" db:"answers"` // JSON object of answers
	Score     int       `json:"score" db:"score"`
	TimeSpent int       `json:"time_spent" db:"time_spent"` // in seconds
	Passed    bool      `json:"passed" db:"passed"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type Progress struct {
	ID           uuid.UUID `json:"id" db:"id"`
	UserID       uuid.UUID `json:"user_id" db:"user_id"`
	MaterialID   uuid.UUID `json:"material_id" db:"material_id"`
	HasViewedSummary bool  `json:"has_viewed_summary" db:"has_viewed_summary"`
	HasTakenQuiz     bool  `json:"has_taken_quiz" db:"has_taken_quiz"`
	BestScore        int   `json:"best_score" db:"best_score"`
	TotalAttempts    int   `json:"total_attempts" db:"total_attempts"`
	LastAccessedAt   time.Time `json:"last_accessed_at" db:"last_accessed_at"`
	CreatedAt        time.Time `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time `json:"updated_at" db:"updated_at"`
}

// Request/Response DTOs
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type RegisterRequest struct {
	Name     string `json:"name" validate:"required,min=2,max=100"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type UploadResponse struct {
	Material Material `json:"material"`
	Message  string   `json:"message"`
}

type SummaryRequest struct {
	MaterialID string `json:"material_id" validate:"required,uuid"`
}

type QuizRequest struct {
	MaterialID string `json:"material_id" validate:"required,uuid"`
}
