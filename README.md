# Quicacademy - AI-Powered Educational Platform

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8)](https://golang.org/)
[![OpenRouter](https://img.shields.io/badge/AI-OpenRouter-purple)](https://openrouter.ai/)

*An intelligent educational platform designed to transform learning through AI-powered content generation and personalized study experiences.*

[Demo](https://quicacademy.vercel.app) • [Documentation](https://github.com/RayendraNagata/Quicacademy/wiki) • [Report Bug](https://github.com/RayendraNagata/Quicacademy/issues) • [Request Feature](https://github.com/RayendraNagata/Quicacademy/issues)

</div>

---

## Overview

Quicacademy is a comprehensive educational platform that leverages artificial intelligence to provide adaptive learning experiences for students across all educational levels. Our platform automatically processes educational materials and generates personalized summaries, quizzes, and interactive learning content.

### Problem Statement
Traditional learning methods often lack personalization and immediate feedback. Students struggle with processing large volumes of educational content, creating effective study materials, accessing personalized learning assistance, and tracking their learning progress efficiently.

### Solution
Quicacademy addresses these challenges by providing automated content processing, intelligent summarization, dynamic quiz generation, 24/7 AI tutoring, and comprehensive progress analytics.

## Key Features

- **Smart File Processing**: Multi-format support with automatic text extraction
- **AI-Powered Learning**: Intelligent summarization and dynamic quiz generation
- **Interactive Assistant**: 24/7 AI tutoring and learning support
- **Progress Analytics**: Comprehensive tracking and performance insights
- **Modern Interface**: Responsive design with intuitive user experience

## Technology Stack

<div align="center">

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend
![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

### AI Integration
![OpenRouter](https://img.shields.io/badge/OpenRouter-purple?style=for-the-badge)
![Claude](https://img.shields.io/badge/Claude_3-orange?style=for-the-badge)

</div>

## Quick Start

### Prerequisites
- Node.js (v18.0 or later)
- Go (v1.21 or later)
- PostgreSQL (v13 or later)
- OpenRouter API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RayendraNagata/Quicacademy.git
   cd Quicacademy
   ```

2. **Setup Frontend**
   ```bash
   npm install
   npm run dev
   ```

3. **Setup Backend**
   ```bash
   cd backend
   cp .env.example .env
   go mod tidy
   go run ./cmd/server
   ```

### Environment Configuration
Configure your `.env` file with database credentials and API keys.

## Project Structure

```
Quicacademy/
├── app/                           # Next.js App Router pages
│   ├── (auth)/                   # Authentication routes
│   ├── dashboard/               # Main dashboard
│   ├── upload/                  # File upload page
│   ├── summary/                 # Summary view page
│   ├── quiz/                    # Quiz interface
│   └── assistant/               # AI chat assistant
├── components/                    # Reusable React components
│   ├── ui/                      # Base UI components
│   ├── auth/                    # Authentication components
│   ├── dashboard/               # Dashboard specific components
│   ├── upload/                  # File upload components
│   └── common/                  # Shared components
├── backend/                       # Go backend server
│   ├── cmd/                     # Application entry points
│   ├── controllers/             # HTTP request handlers
│   ├── models/                  # Data models and structures
│   ├── services/                # Business logic layer
│   ├── middleware/              # HTTP middleware
│   ├── routes/                  # Route definitions
│   └── utils/                   # Utility functions
├── public/                        # Static assets
├── lib/                          # Utility libraries
├── types/                        # TypeScript type definitions
├── hooks/                        # Custom React hooks
├── package.json                  # Node.js dependencies
├── README.md                    # Project documentation
└── LICENSE                      # MIT license file
```

## API Documentation

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User authentication

### Materials
- `POST /api/v1/materials/upload` - Upload educational material
- `GET /api/v1/materials` - List user materials

### AI Features
- `POST /api/v1/summaries/generate/:id` - Generate AI summary
- `POST /api/v1/quizzes/generate/:id` - Create AI quiz
- `POST /api/v1/assistant/chat` - Chat with AI assistant

## Development Roadmap

### Current Features
- User authentication system
- File upload and processing
- AI-powered content summarization
- Dynamic quiz generation
- Interactive AI assistant

### Planned Features
- Advanced PDF processing with OCR
- Export functionality (PDF, Word)
- Mobile application
- Learning analytics dashboard
- Collaborative study groups

## Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started
1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Create** a new branch for your feature
4. **Make** your changes
5. **Test** your changes thoroughly
6. **Submit** a pull request

### Development Guidelines
- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- Ensure all tests pass before submitting
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

### Areas We Need Help With
- Mobile app development
- Internationalization (i18n)
- UI/UX improvements
- Data analytics features
- Security enhancements

### Code of Conduct
Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors & Contributors

<table>
<tr>
<td align="center">
<a href="https://github.com/RayendraNagata">
<img src="https://github.com/RayendraNagata.png" width="100" style="border-radius: 50%"/>
<br />
<strong>Rayendra Nagata</strong>
</a>
<br />
<sub>Project Creator & Lead Developer</sub>
</td>
</tr>
</table>

## Acknowledgments

- [OpenRouter](https://openrouter.ai/) for providing excellent AI API services
- [Next.js](https://nextjs.org/) team for the amazing React framework
- [Go](https://golang.org/) community for the robust backend language
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## Support & Contact

<div align="center">

### Get Help
[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-red?style=for-the-badge&logo=github)](https://github.com/RayendraNagata/Quicacademy/issues)
[![GitHub Discussions](https://img.shields.io/badge/GitHub-Discussions-blue?style=for-the-badge&logo=github)](https://github.com/RayendraNagata/Quicacademy/discussions)

### Stay Connected
[![GitHub](https://img.shields.io/badge/GitHub-RayendraNagata-black?style=for-the-badge&logo=github)](https://github.com/RayendraNagata)

**Repository**: [github.com/RayendraNagata/Quicacademy](https://github.com/RayendraNagata/Quicacademy)

</div>

---

<div align="center">

**Made by Falling in Fall**

*Empowering learners through intelligent technology*

</div>
