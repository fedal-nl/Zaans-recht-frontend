/**
 * Example integration of Quiz API with frontend
 * This demonstrates how to use the Quiz backend from the frontend
 */

// Example: Initialize and use the Quiz API
// Note: In production, this would use the Genezio SDK after deployment

class QuizAPIExample {
  constructor() {
    // This would be replaced with actual Genezio SDK import after deployment
    this.apiBaseUrl = 'http://localhost:8083'; // Local development URL
  }

  /**
   * Example: Create a new quiz
   */
  async createNewQuiz() {
    try {
      console.log('🎯 Creating a new quiz...');
      
      // Example quiz creation
      const quizData = {
        name: 'Zaans Recht Legal Quiz',
        categories: ['legal_terms', 'dutch_legal'], // or null for random
        wordCount: 5
      };

      // In production, this would be:
      // const result = await Quiz.createQuiz(quizData.name, quizData.categories, quizData.wordCount);
      console.log('Quiz created with data:', quizData);
      
      return {
        success: true,
        quizId: 'example_quiz_id',
        words: ['contract', 'rechtbank', 'vonnis', 'liability', 'getuige']
      };
    } catch (error) {
      console.error('Error creating quiz:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Example: Submit quiz results
   */
  async submitQuizResults(quizId, playerName, score, totalQuestions) {
    try {
      console.log('📊 Submitting quiz results...');
      
      // In production, this would be:
      // const result = await Quiz.addScore(quizId, playerName, score, totalQuestions);
      console.log(`Score submitted: ${playerName} scored ${score}/${totalQuestions}`);
      
      return {
        success: true,
        percentage: Math.round((score / totalQuestions) * 100)
      };
    } catch (error) {
      console.error('Error submitting score:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Example: Get available categories
   */
  async getAvailableCategories() {
    try {
      console.log('📚 Fetching available categories...');
      
      // In production, this would be:
      // const result = await Quiz.getCategories();
      return {
        success: true,
        categories: [
          { name: 'legal_terms', wordCount: 10 },
          { name: 'dutch_legal', wordCount: 10 },
          { name: 'family_law', wordCount: 10 },
          { name: 'business_law', wordCount: 10 }
        ]
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Example: Display quiz in HTML
   */
  renderQuizHTML(quiz) {
    return `
      <div class="quiz-container bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold text-zaans-blue mb-6">${quiz.name || 'Legal Terms Quiz'}</h2>
        
        <div class="quiz-info mb-6 p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600 mb-2">Categories: ${(quiz.categories || ['legal_terms']).join(', ')}</p>
          <p class="text-sm text-gray-600">Words to learn: ${(quiz.words || []).length}</p>
        </div>

        <div class="quiz-words mb-6">
          <h3 class="text-lg font-semibold mb-4">Words in this quiz:</h3>
          <div class="grid grid-cols-2 gap-3">
            ${(quiz.words || ['contract', 'rechtbank', 'vonnis', 'liability', 'getuige']).map(word => 
              `<div class="bg-zaans-blue text-white px-3 py-2 rounded text-center">${word}</div>`
            ).join('')}
          </div>
        </div>

        <div class="quiz-actions">
          <button onclick="startQuiz('${quiz.id || 'demo'}')" 
                  class="w-full bg-zaans-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors">
            Start Quiz
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Example: Display high scores
   */
  renderHighScoresHTML(scores) {
    if (!scores || scores.length === 0) {
      return '<p class="text-gray-500 text-center">No scores yet. Be the first to take the quiz!</p>';
    }

    return `
      <div class="high-scores bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-xl font-bold text-zaans-blue mb-4">High Scores</h3>
        <div class="space-y-3">
          ${scores.map((score, index) => `
            <div class="flex justify-between items-center p-3 ${index < 3 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'} rounded">
              <div class="flex items-center">
                <span class="font-bold text-lg mr-3 ${index < 3 ? 'text-yellow-600' : 'text-gray-600'}">${index + 1}.</span>
                <span class="font-medium">${score.playerName}</span>
              </div>
              <div class="text-right">
                <div class="font-bold text-zaans-blue">${score.percentage}%</div>
                <div class="text-sm text-gray-500">${score.score}/${score.totalQuestions}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

// Example usage functions that could be added to the main website
function initializeQuizAPI() {
  window.quizAPI = new QuizAPIExample();
  console.log('Quiz API initialized');
}

async function createDemoQuiz() {
  if (!window.quizAPI) initializeQuizAPI();
  
  const result = await window.quizAPI.createNewQuiz();
  if (result.success) {
    const quizHTML = window.quizAPI.renderQuizHTML(result);
    document.getElementById('quiz-container').innerHTML = quizHTML;
  }
}

async function startQuiz(quizId) {
  console.log('Starting quiz:', quizId);
  // Implementation would depend on frontend framework
  // Could integrate with existing form handling in index.html
}

// Initialize when DOM is loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initializeQuizAPI);
}

export { QuizAPIExample };