from django.contrib import admin
from .models import SpanglishWord, Category, SpanglishPhrase, UserProgress


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']


@admin.register(SpanglishWord)
class SpanglishWordAdmin(admin.ModelAdmin):
    list_display = ['spanglish_word', 'english_word', 'spanish_word', 'created_by', 'created_at']
    list_filter = ['created_at', 'created_by']
    search_fields = ['english_word', 'spanish_word', 'spanglish_word', 'definition']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(SpanglishPhrase)
class SpanglishPhraseAdmin(admin.ModelAdmin):
    list_display = ['phrase', 'difficulty_level', 'created_at']
    list_filter = ['difficulty_level', 'created_at', 'categories']
    search_fields = ['phrase', 'english_translation', 'spanish_translation']
    filter_horizontal = ['categories']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'level', 'total_score', 'words_count', 'phrases_count', 'updated_at']
    list_filter = ['level', 'created_at', 'updated_at']
    search_fields = ['user__username', 'user__email']
    filter_horizontal = ['words_learned', 'phrases_learned']
    ordering = ['-total_score']
    readonly_fields = ['created_at', 'updated_at']

    def words_count(self, obj):
        return obj.words_learned.count()
    words_count.short_description = 'Words Learned'

    def phrases_count(self, obj):
        return obj.phrases_learned.count()
    phrases_count.short_description = 'Phrases Learned'
