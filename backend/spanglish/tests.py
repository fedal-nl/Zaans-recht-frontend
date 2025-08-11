from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import SpanglishWord, Category, SpanglishPhrase, UserProgress


class SpanglishModelsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
    def test_category_creation(self):
        category = Category.objects.create(
            name='Test Category',
            description='A test category'
        )
        self.assertEqual(str(category), 'Test Category')
        
    def test_spanglish_word_creation(self):
        word = SpanglishWord.objects.create(
            english_word='test',
            spanish_word='prueba',
            spanglish_word='testo',
            definition='A test word',
            created_by=self.user
        )
        expected_str = "testo (test / prueba)"
        self.assertEqual(str(word), expected_str)
        
    def test_spanglish_phrase_creation(self):
        phrase = SpanglishPhrase.objects.create(
            phrase='Test phrase',
            english_translation='Test phrase in English',
            spanish_translation='Frase de prueba en español',
            difficulty_level='beginner'
        )
        self.assertEqual(str(phrase), 'Test phrase')
        
    def test_user_progress_creation(self):
        progress = UserProgress.objects.create(user=self.user)
        expected_str = f"{self.user.username}'s Progress (novice)"
        self.assertEqual(str(progress), expected_str)


class SpanglishAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.category = Category.objects.create(
            name='Test Category',
            description='A test category'
        )
        
        self.word = SpanglishWord.objects.create(
            english_word='test',
            spanish_word='prueba',
            spanglish_word='testo',
            definition='A test word',
            created_by=self.user
        )
        
    def test_categories_list(self):
        url = '/spanglish/api/categories/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Category')
        
    def test_words_list(self):
        url = '/spanglish/api/words/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['spanglish_word'], 'testo')
        
    def test_word_search(self):
        url = '/spanglish/api/words/search/?q=test'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['spanglish_word'], 'testo')
        
    def test_phrases_list(self):
        url = '/spanglish/api/phrases/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # No phrases created in setUp
        
    def test_create_word_via_api(self):
        url = '/spanglish/api/words/'
        data = {
            'english_word': 'new',
            'spanish_word': 'nuevo',
            'spanglish_word': 'newvo',
            'definition': 'A new test word'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SpanglishWord.objects.count(), 2)
        
    def test_create_category_via_api(self):
        url = '/spanglish/api/categories/'
        data = {
            'name': 'New Category',
            'description': 'A new test category'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 2)
