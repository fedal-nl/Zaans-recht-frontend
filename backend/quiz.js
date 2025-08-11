/**
 * Quiz model for managing quizzes with scores and random word selection
 * Genezio class for deployment
 */
export class Quiz {
  constructor() {
    // In-memory storage for demonstration - in production use database
    this.quizzes = [];
    this.categories = {
      legal_terms: [
        'contract', 'liability', 'jurisdiction', 'statute', 'defendant',
        'plaintiff', 'precedent', 'testimony', 'evidence', 'verdict'
      ],
      dutch_legal: [
        'rechtbank', 'vonnis', 'verdachte', 'getuige', 'bewijs',
        'hoger_beroep', 'cassatie', 'dagvaarding', 'uitspraak', 'procedure'
      ],
      family_law: [
        'echtscheiding', 'alimentatie', 'voogdij', 'omgangsregeling', 'scheiding',
        'testament', 'erfrecht', 'adoptie', 'huwelijk', 'partnerschap'
      ],
      business_law: [
        'onderneming', 'contract', 'aansprakelijkheid', 'faillissement', 'fusie',
        'overname', 'arbeidsrecht', 'cao', 'ontslag', 'reorganisatie'
      ]
    };
  }

  /**
   * Create a new quiz with random words from specified categories
   * @param {string} quizName - Name of the quiz
   * @param {string[]} selectedCategories - Categories to select words from (optional)
   * @param {number} wordCount - Number of words to include (default: 10)
   * @returns {object} Created quiz object
   */
  async createQuiz(quizName, selectedCategories = null, wordCount = 10) {
    try {
      const quizId = this._generateId();
      
      // If no categories specified, select random categories
      const categoriesToUse = selectedCategories || this._getRandomCategories();
      
      // Get random words from selected categories
      const words = this._getRandomWords(categoriesToUse, wordCount);
      
      const quiz = {
        id: quizId,
        name: quizName,
        categories: categoriesToUse,
        words: words,
        scores: [],
        createdAt: new Date().toISOString(),
        isActive: true
      };
      
      this.quizzes.push(quiz);
      
      return {
        success: true,
        quiz: quiz,
        message: `Quiz "${quizName}" created successfully with ${words.length} words`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Add a score to a quiz
   * @param {string} quizId - Quiz identifier
   * @param {string} playerName - Name of the player
   * @param {number} score - Score achieved
   * @param {number} totalQuestions - Total number of questions
   * @returns {object} Result of score addition
   */
  async addScore(quizId, playerName, score, totalQuestions) {
    try {
      const quiz = this.quizzes.find(q => q.id === quizId);
      
      if (!quiz) {
        return {
          success: false,
          error: `Quiz with ID ${quizId} not found`
        };
      }
      
      const scoreEntry = {
        id: this._generateId(),
        playerName: playerName,
        score: score,
        totalQuestions: totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        completedAt: new Date().toISOString()
      };
      
      quiz.scores.push(scoreEntry);
      
      return {
        success: true,
        scoreEntry: scoreEntry,
        message: `Score added successfully for ${playerName}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all quizzes
   * @returns {object[]} Array of all quizzes
   */
  async getAllQuizzes() {
    return {
      success: true,
      quizzes: this.quizzes
    };
  }

  /**
   * Get a specific quiz by ID
   * @param {string} quizId - Quiz identifier
   * @returns {object} Quiz object
   */
  async getQuiz(quizId) {
    const quiz = this.quizzes.find(q => q.id === quizId);
    
    if (!quiz) {
      return {
        success: false,
        error: `Quiz with ID ${quizId} not found`
      };
    }
    
    return {
      success: true,
      quiz: quiz
    };
  }

  /**
   * Get available categories
   * @returns {object} Available categories with word counts
   */
  async getCategories() {
    const categoryInfo = Object.keys(this.categories).map(category => ({
      name: category,
      wordCount: this.categories[category].length,
      words: this.categories[category]
    }));
    
    return {
      success: true,
      categories: categoryInfo
    };
  }

  /**
   * Get random words from specified categories
   * @param {string[]} categories - Categories to select from
   * @param {number} count - Number of words to select
   * @returns {string[]} Array of random words
   */
  _getRandomWords(categories, count) {
    const allWords = [];
    
    categories.forEach(category => {
      if (this.categories[category]) {
        allWords.push(...this.categories[category]);
      }
    });
    
    // Shuffle and select random words
    const shuffled = allWords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  /**
   * Get random categories (1-3 categories)
   * @returns {string[]} Array of random category names
   */
  _getRandomCategories() {
    const availableCategories = Object.keys(this.categories);
    const numberOfCategories = Math.floor(Math.random() * 3) + 1; // 1-3 categories
    
    const shuffled = availableCategories.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numberOfCategories);
  }

  /**
   * Generate a unique ID
   * @returns {string} Unique identifier
   */
  _generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}