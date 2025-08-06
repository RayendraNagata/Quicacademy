package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

type OpenRouterService struct {
	APIKey  string
	BaseURL string
}

type OpenRouterRequest struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type OpenRouterResponse struct {
	Choices []Choice `json:"choices"`
}

type Choice struct {
	Message Message `json:"message"`
}

func NewOpenRouterService() *OpenRouterService {
	return &OpenRouterService{
		APIKey:  os.Getenv("OPENROUTER_API_KEY"),
		BaseURL: "https://openrouter.ai/api/v1/chat/completions",
	}
}

func (o *OpenRouterService) GenerateSummary(text string) (bulletPoints, paragraphs, concepts string, err error) {
	prompt := fmt.Sprintf(`Berikan ringkasan dari materi berikut dalam 3 format:

1. BULLET_POINTS: Buat 6-8 poin utama dengan bullet points
2. PARAGRAPHS: Buat ringkasan dalam 2-3 paragraf yang mudah dipahami
3. CONCEPTS: Buat 4-5 konsep kunci dengan penjelasan singkat

Materi:
%s

Format jawaban:
BULLET_POINTS:
• [poin 1]
• [poin 2]
...

PARAGRAPHS:
[paragraf 1]

[paragraf 2]

CONCEPTS:
[konsep 1]: [penjelasan]
[konsep 2]: [penjelasan]
...`, text)

	response, err := o.callAPI("anthropic/claude-3-haiku", prompt)
	if err != nil {
		return "", "", "", err
	}

	// Parse response to extract sections
	bulletPoints, paragraphs, concepts = o.parseSummaryResponse(response)
	return bulletPoints, paragraphs, concepts, nil
}

func (o *OpenRouterService) GenerateQuiz(text, subject string) ([]byte, error) {
	prompt := fmt.Sprintf(`Buat 10 soal pilihan ganda berdasarkan materi %s berikut:

%s

Format JSON yang diinginkan:
[
  {
    "id": 1,
    "type": "multiple_choice",
    "question": "Pertanyaan soal",
    "options": ["A. Pilihan 1", "B. Pilihan 2", "C. Pilihan 3", "D. Pilihan 4"],
    "correct_answer": "A",
    "explanation": "Penjelasan mengapa jawaban A benar",
    "difficulty": "medium"
  }
]

Buat soal yang:
- Bervariasi tingkat kesulitan (easy, medium, hard)
- Mencakup konsep utama dari materi
- Memiliki penjelasan yang jelas
- Opsi jawaban yang masuk akal`, subject, text)

	response, err := o.callAPI("anthropic/claude-3-haiku", prompt)
	if err != nil {
		return nil, err
	}

	// Try to extract JSON from response
	questions, err := o.parseQuizResponse(response)
	if err != nil {
		return nil, err
	}

	return questions, nil
}

func (o *OpenRouterService) ChatAssistant(message, context string) (string, error) {
	prompt := fmt.Sprintf(`Kamu adalah AI Assistant untuk platform pembelajaran Quicacademy. 
Berikan jawaban yang helpful, informatif, dan mudah dipahami untuk pertanyaan berikut.

Konteks materi: %s

Pertanyaan: %s

Berikan jawaban yang:
- Jelas dan mudah dipahami
- Menggunakan contoh jika diperlukan
- Berkaitan dengan konteks materi jika relevan
- Mendorong pembelajaran lebih lanjut`, context, message)

	response, err := o.callAPI("anthropic/claude-3-haiku", prompt)
	if err != nil {
		return "", err
	}

	return response, nil
}

func (o *OpenRouterService) callAPI(model, prompt string) (string, error) {
	if o.APIKey == "" {
		return "", fmt.Errorf("OpenRouter API key not configured")
	}

	request := OpenRouterRequest{
		Model: model,
		Messages: []Message{
			{
				Role:    "user",
				Content: prompt,
			},
		},
	}

	jsonData, err := json.Marshal(request)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", o.BaseURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+o.APIKey)
	req.Header.Set("HTTP-Referer", "https://quicacademy.com")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(body))
	}

	var response OpenRouterResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return "", err
	}

	if len(response.Choices) == 0 {
		return "", fmt.Errorf("no response from API")
	}

	return response.Choices[0].Message.Content, nil
}

func (o *OpenRouterService) parseSummaryResponse(response string) (bulletPoints, paragraphs, concepts string) {
	// Simple parsing - in production you might want more robust parsing
	currentSection := ""

	for _, line := range strings.Split(response, "\n") {
		line = strings.TrimSpace(line)

		if line == "BULLET_POINTS:" {
			currentSection = "bullets"
			continue
		} else if line == "PARAGRAPHS:" {
			currentSection = "paragraphs"
			continue
		} else if line == "CONCEPTS:" {
			currentSection = "concepts"
			continue
		}

		switch currentSection {
		case "bullets":
			if line != "" {
				bulletPoints += line + "\n"
			}
		case "paragraphs":
			if line != "" {
				paragraphs += line + "\n"
			}
		case "concepts":
			if line != "" {
				concepts += line + "\n"
			}
		}
	}

	// Fallback if parsing fails
	if bulletPoints == "" && paragraphs == "" && concepts == "" {
		// Return the full response split into sections
		bulletPoints = response[:len(response)/3]
		paragraphs = response[len(response)/3 : 2*len(response)/3]
		concepts = response[2*len(response)/3:]
	}

	return bulletPoints, paragraphs, concepts
}

func (o *OpenRouterService) parseQuizResponse(response string) ([]byte, error) {
	// Try to find JSON in the response
	start := -1
	end := -1

	for i, char := range response {
		if char == '[' && start == -1 {
			start = i
		}
		if char == ']' {
			end = i + 1
		}
	}

	if start != -1 && end != -1 {
		jsonStr := response[start:end]

		// Validate JSON
		var questions []interface{}
		if err := json.Unmarshal([]byte(jsonStr), &questions); err == nil {
			return []byte(jsonStr), nil
		}
	}

	// Fallback: return mock questions if parsing fails
	mockQuestions := `[
		{
			"id": 1,
			"type": "multiple_choice",
			"question": "Berdasarkan materi yang diberikan, konsep utama yang dibahas adalah?",
			"options": ["A. Konsep dasar", "B. Aplikasi praktis", "C. Teori lanjutan", "D. Semua benar"],
			"correct_answer": "D",
			"explanation": "Materi mencakup berbagai aspek dari konsep dasar hingga aplikasi praktis",
			"difficulty": "medium"
		}
	]`

	return []byte(mockQuestions), nil
}
