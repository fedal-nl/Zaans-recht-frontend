# Quiz Model Documentation

This backend implements a quiz model that allows creating quizzes with scores and random word selection from categories.

## Features

- ✅ Create quizzes with random words from specific categories
- ✅ Create quizzes with random category selection
- ✅ Score tracking with player names and percentages
- ✅ Four predefined legal categories with Dutch and English terms
- ✅ Full CRUD operations for quizzes and scores

## Categories

The system includes four predefined categories:

1. **legal_terms** - General legal terminology in English
2. **dutch_legal** - Dutch legal terms  
3. **family_law** - Family law related terms
4. **business_law** - Business and corporate law terms

Each category contains 10 relevant terms.

## API Methods

### Quiz.createQuiz(name, categories, wordCount)
Creates a new quiz with specified parameters.

**Parameters:**
- `name` (string): Name of the quiz
- `categories` (array, optional): Array of category names. If null, random categories are selected
- `wordCount` (number, optional): Number of words to include (default: 10)

**Returns:** Quiz object with id, name, categories, words, and metadata

### Quiz.addScore(quizId, playerName, score, totalQuestions)
Adds a score entry to a specific quiz.

**Parameters:**
- `quizId` (string): Quiz identifier
- `playerName` (string): Name of the player
- `score` (number): Points scored
- `totalQuestions` (number): Total number of questions

**Returns:** Score entry with percentage calculation and timestamp

### Quiz.getQuiz(quizId)
Retrieves a specific quiz with all scores.

### Quiz.getAllQuizzes()
Returns all created quizzes.

### Quiz.getCategories()
Returns available categories with word counts.

## Local Development

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Run tests:
   ```bash
   node test-quiz.js
   ```

3. Start local Genezio server:
   ```bash
   cd ..
   npx genezio local
   ```

4. Access API explorer at http://localhost:8083/explore

## Example Usage

```javascript
// Create a quiz with specific categories
const quiz = await Quiz.createQuiz(
  'Legal Terms Quiz', 
  ['legal_terms', 'dutch_legal'], 
  5
);

// Add a score
await Quiz.addScore(quiz.id, 'Jan Jansen', 4, 5);

// Get quiz with scores
const quizWithScores = await Quiz.getQuiz(quiz.id);
```

## Deployment

The backend is configured for Genezio deployment. Run:

```bash
npx genezio deploy
```

After deployment, generate the frontend SDK:

```bash
npx genezio sdk
```

## Integration with Frontend

See `js/quiz-api-example.js` for frontend integration examples.