from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from spanglish.models import Category, SpanglishWord, SpanglishPhrase


class Command(BaseCommand):
    help = 'Create sample data for the Spanglish app'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

        # Create categories
        categories_data = [
            {'name': 'Food', 'description': 'Food-related terms'},
            {'name': 'Family', 'description': 'Family and relationships'},
            {'name': 'Work', 'description': 'Work and business terms'},
            {'name': 'Daily Life', 'description': 'Everyday activities'},
        ]

        categories = []
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(**cat_data)
            categories.append(category)
            if created:
                self.stdout.write(f'Created category: {category.name}')

        # Create a sample user
        user, created = User.objects.get_or_create(
            username='testuser',
            defaults={'email': 'test@example.com', 'first_name': 'Test', 'last_name': 'User'}
        )

        # Create sample words
        words_data = [
            {
                'english_word': 'sandwich',
                'spanish_word': 'sándwich',
                'spanglish_word': 'sanguche',
                'definition': 'A popular way to say sandwich in Spanglish',
                'example_sentence': 'I want a sanguche for lunch.',
                'created_by': user
            },
            {
                'english_word': 'party',
                'spanish_word': 'fiesta',
                'spanglish_word': 'parti',
                'definition': 'An anglicized way to say party',
                'example_sentence': 'Vamos al parti tonight.',
                'created_by': user
            },
            {
                'english_word': 'truck',
                'spanish_word': 'camión',
                'spanglish_word': 'troca',
                'definition': 'A common Spanglish term for truck',
                'example_sentence': 'Mi troca está en el parking.',
                'created_by': user
            },
        ]

        for word_data in words_data:
            word, created = SpanglishWord.objects.get_or_create(
                spanglish_word=word_data['spanglish_word'],
                defaults=word_data
            )
            if created:
                self.stdout.write(f'Created word: {word.spanglish_word}')

        # Create sample phrases
        phrases_data = [
            {
                'phrase': 'Vamos al shopping',
                'english_translation': "Let's go to the mall",
                'spanish_translation': 'Vamos al centro comercial',
                'context': 'Used when suggesting to go shopping',
                'difficulty_level': 'beginner',
            },
            {
                'phrase': 'Está muy nice',
                'english_translation': "It's very nice",
                'spanish_translation': 'Está muy bonito/bueno',
                'context': 'General approval or compliment',
                'difficulty_level': 'beginner',
            },
            {
                'phrase': 'Te llamo pa\' back',
                'english_translation': "I'll call you back",
                'spanish_translation': 'Te devuelvo la llamada',
                'context': 'When you need to return a phone call',
                'difficulty_level': 'intermediate',
            },
        ]

        for phrase_data in phrases_data:
            phrase, created = SpanglishPhrase.objects.get_or_create(
                phrase=phrase_data['phrase'],
                defaults=phrase_data
            )
            if created:
                # Add some categories to phrases
                if 'shopping' in phrase.phrase.lower():
                    phrase.categories.add(categories[3])  # Daily Life
                elif 'nice' in phrase.phrase.lower():
                    phrase.categories.add(categories[3])  # Daily Life
                elif 'call' in phrase.english_translation.lower():
                    phrase.categories.add(categories[2])  # Work

                self.stdout.write(f'Created phrase: {phrase.phrase}')

        self.stdout.write(self.style.SUCCESS('Sample data created successfully!'))