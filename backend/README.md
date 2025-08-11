# Spanglish App Backend

This is the Django backend for the Spanglish learning application. It provides REST API endpoints for managing Spanglish words, phrases, categories, and user progress.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Navigate to the backend directory:
```bash
cd backend
```

3. Run database migrations:
```bash
python manage.py migrate
```

4. Create sample data (optional):
```bash
python manage.py create_sample_data
```

5. Start the development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/spanglish/api/`

## API Endpoints

### Categories
- `GET /spanglish/api/categories/` - List all categories
- `POST /spanglish/api/categories/` - Create a new category
- `GET /spanglish/api/categories/{id}/` - Get category details
- `PUT /spanglish/api/categories/{id}/` - Update category
- `DELETE /spanglish/api/categories/{id}/` - Delete category

### Spanglish Words
- `GET /spanglish/api/words/` - List all words
- `POST /spanglish/api/words/` - Create a new word
- `GET /spanglish/api/words/{id}/` - Get word details
- `PUT /spanglish/api/words/{id}/` - Update word
- `DELETE /spanglish/api/words/{id}/` - Delete word
- `GET /spanglish/api/words/search/?q={query}` - Search words
- `GET /spanglish/api/words/random/?count={number}` - Get random words

### Spanglish Phrases
- `GET /spanglish/api/phrases/` - List all phrases
- `POST /spanglish/api/phrases/` - Create a new phrase
- `GET /spanglish/api/phrases/{id}/` - Get phrase details
- `PUT /spanglish/api/phrases/{id}/` - Update phrase
- `DELETE /spanglish/api/phrases/{id}/` - Delete phrase
- `GET /spanglish/api/phrases/by_difficulty/?level={level}` - Get phrases by difficulty
- `GET /spanglish/api/phrases/random/?count={number}&level={level}` - Get random phrases

### User Progress (Requires Authentication)
- `GET /spanglish/api/progress/my_progress/` - Get current user's progress
- `POST /spanglish/api/progress/my_progress/` - Update current user's progress
- `POST /spanglish/api/progress/add_learned_word/` - Add word to learned words
- `POST /spanglish/api/progress/add_learned_phrase/` - Add phrase to learned phrases

### Users
- `GET /spanglish/api/users/` - List all users
- `GET /spanglish/api/users/{id}/` - Get user details

## Models

### SpanglishWord
- `english_word` - English translation
- `spanish_word` - Spanish translation  
- `spanglish_word` - The Spanglish term
- `definition` - Definition/explanation
- `example_sentence` - Example usage
- `created_by` - User who created the word

### Category
- `name` - Category name
- `description` - Category description

### SpanglishPhrase
- `phrase` - The Spanglish phrase
- `english_translation` - English translation
- `spanish_translation` - Spanish translation
- `context` - When to use this phrase
- `difficulty_level` - beginner, intermediate, or advanced
- `categories` - Associated categories

### UserProgress
- `user` - Associated user
- `words_learned` - Many-to-many with SpanglishWord
- `phrases_learned` - Many-to-many with SpanglishPhrase
- `total_score` - User's total points
- `level` - User's current level (novice, apprentice, expert, master)

## Running Tests

```bash
python manage.py test spanglish
```

## Admin Interface

Access the Django admin at `http://localhost:8000/admin/` to manage data through a web interface.

Create a superuser with:
```bash
python manage.py createsuperuser
```