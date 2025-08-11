from rest_framework import serializers
from django.contrib.auth.models import User
from .models import SpanglishWord, Category, SpanglishPhrase, UserProgress


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


class SpanglishWordSerializer(serializers.ModelSerializer):
    """Serializer for SpanglishWord model"""
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = SpanglishWord
        fields = [
            'id', 'english_word', 'spanish_word', 'spanglish_word',
            'definition', 'example_sentence', 'created_at', 'updated_at',
            'created_by'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Set the created_by field to the current user if authenticated
        if 'request' in self.context and self.context['request'].user.is_authenticated:
            validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class SpanglishPhraseSerializer(serializers.ModelSerializer):
    """Serializer for SpanglishPhrase model"""
    categories = CategorySerializer(many=True, read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Category.objects.all(), 
        source='categories', 
        write_only=True,
        required=False
    )
    
    class Meta:
        model = SpanglishPhrase
        fields = [
            'id', 'phrase', 'english_translation', 'spanish_translation',
            'context', 'difficulty_level', 'categories', 'category_ids',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserProgressSerializer(serializers.ModelSerializer):
    """Serializer for UserProgress model"""
    user = UserSerializer(read_only=True)
    words_learned = SpanglishWordSerializer(many=True, read_only=True)
    phrases_learned = SpanglishPhraseSerializer(many=True, read_only=True)
    words_learned_count = serializers.SerializerMethodField()
    phrases_learned_count = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProgress
        fields = [
            'id', 'user', 'words_learned', 'phrases_learned',
            'words_learned_count', 'phrases_learned_count',
            'total_score', 'level', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_words_learned_count(self, obj):
        return obj.words_learned.count()

    def get_phrases_learned_count(self, obj):
        return obj.phrases_learned.count()


class SimpleSpanglishWordSerializer(serializers.ModelSerializer):
    """Simplified serializer for SpanglishWord model (for listings)"""
    class Meta:
        model = SpanglishWord
        fields = ['id', 'english_word', 'spanish_word', 'spanglish_word']


class SimpleSpanglishPhraseSerializer(serializers.ModelSerializer):
    """Simplified serializer for SpanglishPhrase model (for listings)"""
    class Meta:
        model = SpanglishPhrase
        fields = ['id', 'phrase', 'difficulty_level']