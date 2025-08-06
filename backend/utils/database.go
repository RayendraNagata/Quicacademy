package utils

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func InitDB(databaseURL string) (*sql.DB, error) {
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Println("Database connected successfully")
	return db, nil
}

func CreateTables(db *sql.DB) error {
	queries := []string{
		`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
		
		`CREATE TABLE IF NOT EXISTS users (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			name VARCHAR(100) NOT NULL,
			email VARCHAR(255) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		);`,

		`CREATE TABLE IF NOT EXISTS materials (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			title VARCHAR(200) NOT NULL,
			subject VARCHAR(100) NOT NULL,
			file_name VARCHAR(255) NOT NULL,
			file_url TEXT NOT NULL,
			file_size BIGINT NOT NULL,
			file_type VARCHAR(50) NOT NULL,
			status VARCHAR(20) DEFAULT 'uploading',
			extracted_text TEXT,
			word_count INTEGER DEFAULT 0,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		);`,

		`CREATE TABLE IF NOT EXISTS summaries (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
			bullet_points TEXT,
			paragraphs TEXT,
			concepts TEXT,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		);`,

		`CREATE TABLE IF NOT EXISTS quizzes (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
			title VARCHAR(200) NOT NULL,
			questions TEXT NOT NULL,
			time_limit INTEGER DEFAULT 1800,
			passing_score INTEGER DEFAULT 70,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
		);`,

		`CREATE TABLE IF NOT EXISTS quiz_attempts (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
			answers TEXT NOT NULL,
			score INTEGER NOT NULL,
			time_spent INTEGER NOT NULL,
			passed BOOLEAN NOT NULL,
			created_at TIMESTAMP DEFAULT NOW()
		);`,

		`CREATE TABLE IF NOT EXISTS progress (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
			has_viewed_summary BOOLEAN DEFAULT FALSE,
			has_taken_quiz BOOLEAN DEFAULT FALSE,
			best_score INTEGER DEFAULT 0,
			total_attempts INTEGER DEFAULT 0,
			last_accessed_at TIMESTAMP DEFAULT NOW(),
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW(),
			UNIQUE(user_id, material_id)
		);`,

		`CREATE INDEX IF NOT EXISTS idx_materials_user_id ON materials(user_id);`,
		`CREATE INDEX IF NOT EXISTS idx_materials_status ON materials(status);`,
		`CREATE INDEX IF NOT EXISTS idx_summaries_material_id ON summaries(material_id);`,
		`CREATE INDEX IF NOT EXISTS idx_quizzes_material_id ON quizzes(material_id);`,
		`CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);`,
		`CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);`,
		`CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);`,
	}

	for _, query := range queries {
		if _, err := db.Exec(query); err != nil {
			return fmt.Errorf("failed to execute query: %s, error: %w", query, err)
		}
	}

	log.Println("Database tables created successfully")
	return nil
}
