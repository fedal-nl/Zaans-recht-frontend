import { Quiz } from './quiz.js';

/**
 * Simple test script for Quiz functionality
 */
async function testQuizFunctionality() {
  console.log('🧪 Testing Quiz Model...\n');
  
  const quiz = new Quiz();
  
  try {
    // Test 1: Get available categories
    console.log('1. Testing getCategories...');
    const categoriesResult = await quiz.getCategories();
    console.log('✅ Categories:', categoriesResult.categories.map(c => c.name));
    console.log('');

    // Test 2: Create a quiz with specific categories
    console.log('2. Testing createQuiz with specific categories...');
    const quizResult = await quiz.createQuiz(
      'Legal Terms Quiz', 
      ['legal_terms', 'dutch_legal'], 
      5
    );
    console.log('✅ Quiz created:', quizResult.quiz.name);
    console.log('   Words:', quizResult.quiz.words);
    console.log('   Categories:', quizResult.quiz.categories);
    console.log('');

    // Test 3: Create a quiz with random categories
    console.log('3. Testing createQuiz with random categories...');
    const randomQuizResult = await quiz.createQuiz('Random Quiz');
    console.log('✅ Random quiz created:', randomQuizResult.quiz.name);
    console.log('   Random categories selected:', randomQuizResult.quiz.categories);
    console.log('   Words count:', randomQuizResult.quiz.words.length);
    console.log('');

    // Test 4: Add scores to the quiz
    console.log('4. Testing addScore...');
    const scoreResult1 = await quiz.addScore(
      quizResult.quiz.id, 
      'Jan Jansen', 
      4, 
      5
    );
    console.log('✅ Score added:', scoreResult1.scoreEntry);
    
    const scoreResult2 = await quiz.addScore(
      quizResult.quiz.id, 
      'Marie van der Berg', 
      3, 
      5
    );
    console.log('✅ Score added:', scoreResult2.scoreEntry);
    console.log('');

    // Test 5: Get quiz with scores
    console.log('5. Testing getQuiz...');
    const getQuizResult = await quiz.getQuiz(quizResult.quiz.id);
    console.log('✅ Quiz retrieved with scores:');
    console.log('   Quiz name:', getQuizResult.quiz.name);
    console.log('   Total scores:', getQuizResult.quiz.scores.length);
    getQuizResult.quiz.scores.forEach(score => {
      console.log(`   - ${score.playerName}: ${score.score}/${score.totalQuestions} (${score.percentage}%)`);
    });
    console.log('');

    // Test 6: Get all quizzes
    console.log('6. Testing getAllQuizzes...');
    const allQuizzesResult = await quiz.getAllQuizzes();
    console.log('✅ Total quizzes:', allQuizzesResult.quizzes.length);
    allQuizzesResult.quizzes.forEach(q => {
      console.log(`   - ${q.name} (${q.words.length} words, ${q.scores.length} scores)`);
    });

    console.log('\n🎉 All tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests if this file is executed directly
testQuizFunctionality();

export { testQuizFunctionality };