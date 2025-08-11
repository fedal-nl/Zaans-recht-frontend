from django.db import models
from django.contrib.auth.models import User


class SpanglishWord(models.Model):
    """Model for storing Spanglish words and their translations"""
    english_word = models.CharField(max_length=200)
    spanish_word = models.CharField(max_length=200)
    spanglish_word = models.CharField(max_length=200)
    definition = models.TextField(blank=True)
    example_sentence = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Spanglish Word'
        verbose_name_plural = 'Spanglish Words'

    def __str__(self):
        return f"{self.spanglish_word} ({self.english_word} / {self.spanish_word})"


class Category(models.Model):
    """Model for categorizing Spanglish words"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class SpanglishPhrase(models.Model):
    """Model for storing common Spanglish phrases"""
    phrase = models.CharField(max_length=500)
    english_translation = models.CharField(max_length=500)
    spanish_translation = models.CharField(max_length=500)
    context = models.TextField(blank=True, help_text="When to use this phrase")
    difficulty_level = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
        ],
        default='beginner'
    )
    categories = models.ManyToManyField(Category, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Spanglish Phrase'
        verbose_name_plural = 'Spanglish Phrases'

    def __str__(self):
        return self.phrase


class UserProgress(models.Model):
    """Model for tracking user learning progress"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    words_learned = models.ManyToManyField(SpanglishWord, blank=True)
    phrases_learned = models.ManyToManyField(SpanglishPhrase, blank=True)
    total_score = models.IntegerField(default=0)
    level = models.CharField(
        max_length=20,
        choices=[
            ('novice', 'Novice'),
            ('apprentice', 'Apprentice'),
            ('expert', 'Expert'),
            ('master', 'Master'),
        ],
        default='novice'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user']
        verbose_name = 'User Progress'
        verbose_name_plural = 'User Progress'

    def __str__(self):
        return f"{self.user.username}'s Progress ({self.level})"
