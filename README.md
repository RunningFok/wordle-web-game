# Wordle Web Game - Full Stack Implementation

A modern, full-stack implementation of the popular Wordle game with both classic and speed modes, built with React/TypeScript frontend and Go backend.

## 🏗️ Architecture Overview

### System Design
- **Frontend**: React 18 with TypeScript, Context API for state management
- **Backend**: Go with Gin framework, SQLite database
- **Communication**: RESTful API with JSON serialization

### Key Architectural Decisions

#### 1. **Hybrid Game Modes**
- **Classic Mode**: Client-side game logic for offline play
- **Speed Mode**: Server-side game logic for competitive play with timer

#### 2. **Database Design**
- **SQLite**: Chosen for development simplicity and zero-configuration setup
- **JSON Storage**: Game tries stored as JSON for flexibility

#### 3. **State Management**
- **Context API**: Chosen over Redux for simpler state management
- **Custom Hooks**: Clean component integration with `useGame()`
- **Error Boundaries**: Comprehensive error handling

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Go 1.19+
- Git

### Backend Setup
```bash
cd backend
go mod download
go run main.go
```
Server runs on `http://localhost:8080`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`

### Environment Variables
```bash
# Backend
PORT=8080
API_URL=http://localhost:3000

# Frontend
REACT_APP_API_URL=http://localhost:8080
```

## 🎮 Game Features

### Game Modes
1. **Classic Mode**
   - Client-side game logic
   - Offline play capability
   - No time pressure

2. **Speed Mode**
   - Server-side game logic
   - 45-second timer per guess
   - Competitive gameplay

### Game Configuration
- **Word Sizes**: 4, 5, or 6 letters
- **Max Tries**: 5-7 attempts
- **Word Lists**: Curated lists for each word size

## 🏛️ Code Architecture

### Backend Structure
```
backend/
├── main.go              # Server initialization and routing
├── models/              # Domain models and business logic
│   └── gamestate.go     # Game state management
├── routes/              # HTTP route handlers
│   └── gamestates.go    # Game state endpoints
├── database/            # Database layer
│   └── database.go      # Connection and schema management
├── helpers/             # Utility functions
│   └── helpers.go       # Word validation and ID generation
└── data/                # Static data
    └── word-list.go     # Word lists for different sizes
```

### Frontend Structure
```
frontend/src/
├── App.tsx              # Main application component
├── contexts/            # State management
│   └── GameContext.tsx  # Game state context
├── components/          # UI components
│   ├── GameBoard.tsx    # Game grid display
│   ├── GameKeyboard.tsx # Virtual keyboard
│   └── GameTimer.tsx    # Timer component
├── services/            # API communication
│   └── api.ts           # HTTP client
├── helpers/             # Game logic
│   └── gameLogic.ts     # Client-side game algorithms
└── types/               # TypeScript definitions
    └── core.ts          # Core type definitions
```

## 🔧 Design Patterns & Trade-offs

### Design Patterns Used
1. **Repository Pattern**: Database operations encapsulated in models
2. **Factory Pattern**: Game state creation with validation
3. **Strategy Pattern**: Different game modes handled polymorphically
4. **Provider Pattern**: Context API for global state
5. **Service Layer Pattern**: API abstraction layer

### Key Trade-offs

#### 1. **SQLite vs PostgreSQL**
- **Chosen**: SQLite for development
- **Rationale**: Zero-configuration setup, easy deployment
- **Trade-off**: Scaling upward for more sophisticated database

#### 2. **Context vs Redux**
- **Chosen**: Context API
- **Rationale**: Simpler state management, fewer dependencies
- **Trade-off**: Less sophisticated state management features

#### 3. **Client vs Server Logic**
- **Chosen**: Hybrid approach
- **Rationale**: Classic mode for offline play, speed mode for competitive
- **Trade-off**: Code duplication between client and server

#### 4. **JSON vs Normalized Storage**
- **Chosen**: JSON storage for game tries
- **Rationale**: Flexibility for game state evolution
- **Trade-off**: Less efficient queries, harder to analyze

## 🧪 Testing Strategy

### Backend Testing
```bash
cd backend
go test ./...
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
Use the provided HTTP files in `backend/api-test/`:
- `create-gamestate.http`
- `play-gamestate.http`
- `get-gamestate-by-id.http`

## 🚀 Deployment


### Production Considerations
1. **Database**: Migrate to PostgreSQL
2. **Security**: Add authentication and rate limiting
3. **Monitoring**: Add health checks and logging
4. **Scaling**: Implement horizontal scaling with load balancer

## 📊 Performance Optimizations

### Backend
- Connection pooling (MaxOpenConns: 10, MaxIdleConns: 5)
- Efficient JSON marshaling/unmarshaling
- Optimized database queries

### Frontend
- Code splitting with dynamic imports
- useCallback for stable function references
- AnimatePresence for efficient animations
- Conditional rendering to avoid unnecessary mounts

## 🔒 Security Considerations

### Current Implementation
- Input validation on all endpoints
- SQL injection prevention with parameterized queries
- CORS configuration for cross-origin requests

### Production Improvements
- Authentication and authorization
- Rate limiting for API endpoints
- Input sanitization and validation
- HTTPS enforcement

## 🛠️ Development Guidelines

### Code Quality
- TypeScript for type safety
- Comprehensive error handling
- Consistent naming conventions
- Detailed code comments

### Git Workflow
- Feature branches for new development
- Descriptive commit messages
- Code review process
- Automated testing on PRs

## 📈 Future Enhancements

### Planned Features
1. **User Authentication**: Player accounts and statistics
2. **Leaderboards**: Global and friend rankings
3. **Multiplayer**: Real-time competitive games
4. **Themes**: Customizable UI themes
5. **Analytics**: Game performance tracking

### Technical Improvements
1. **Caching**: Redis for session management
2. **WebSockets**: Real-time multiplayer support
3. **Microservices**: Split into smaller services
4. **CI/CD**: Automated deployment pipelines