from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from django.db.models import Q

from .models import SpanglishWord, Category, SpanglishPhrase, UserProgress
from .serializers import (
    SpanglishWordSerializer, CategorySerializer, SpanglishPhraseSerializer,
    UserProgressSerializer, UserSerializer, SimpleSpanglishWordSerializer,
    SimpleSpanglishPhraseSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for Category model"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class SpanglishWordViewSet(viewsets.ModelViewSet):
    """ViewSet for SpanglishWord model"""
    queryset = SpanglishWord.objects.all()
    serializer_class = SpanglishWordSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['english_word', 'spanish_word', 'spanglish_word', 'definition']
    ordering_fields = ['english_word', 'spanish_word', 'spanglish_word', 'created_at']
    ordering = ['-created_at']
    filterset_fields = ['created_by']

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search words by query parameter"""
        query = request.query_params.get('q', '')
        if query:
            words = self.queryset.filter(
                Q(english_word__icontains=query) |
                Q(spanish_word__icontains=query) |
                Q(spanglish_word__icontains=query) |
                Q(definition__icontains=query)
            )
            serializer = SimpleSpanglishWordSerializer(words, many=True)
            return Response(serializer.data)
        return Response([])

    @action(detail=False, methods=['get'])
    def random(self, request):
        """Get random words for practice"""
        count = min(int(request.query_params.get('count', 5)), 20)
        words = self.queryset.order_by('?')[:count]
        serializer = self.get_serializer(words, many=True)
        return Response(serializer.data)


class SpanglishPhraseViewSet(viewsets.ModelViewSet):
    """ViewSet for SpanglishPhrase model"""
    queryset = SpanglishPhrase.objects.all()
    serializer_class = SpanglishPhraseSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['phrase', 'english_translation', 'spanish_translation', 'context']
    ordering_fields = ['phrase', 'difficulty_level', 'created_at']
    ordering = ['-created_at']
    filterset_fields = ['difficulty_level', 'categories']

    @action(detail=False, methods=['get'])
    def by_difficulty(self, request):
        """Get phrases by difficulty level"""
        level = request.query_params.get('level', 'beginner')
        phrases = self.queryset.filter(difficulty_level=level)
        serializer = SimpleSpanglishPhraseSerializer(phrases, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def random(self, request):
        """Get random phrases for practice"""
        count = min(int(request.query_params.get('count', 3)), 10)
        level = request.query_params.get('level')
        
        queryset = self.queryset
        if level:
            queryset = queryset.filter(difficulty_level=level)
            
        phrases = queryset.order_by('?')[:count]
        serializer = self.get_serializer(phrases, many=True)
        return Response(serializer.data)


class UserProgressViewSet(viewsets.ModelViewSet):
    """ViewSet for UserProgress model"""
    queryset = UserProgress.objects.all()
    serializer_class = UserProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter queryset to current user's progress only"""
        if self.request.user.is_authenticated:
            return self.queryset.filter(user=self.request.user)
        return self.queryset.none()

    @action(detail=False, methods=['get', 'post'])
    def my_progress(self, request):
        """Get or create current user's progress"""
        if request.method == 'GET':
            progress, created = UserProgress.objects.get_or_create(user=request.user)
            serializer = self.get_serializer(progress)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            progress, created = UserProgress.objects.get_or_create(user=request.user)
            serializer = self.get_serializer(progress, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def add_learned_word(self, request):
        """Add a word to user's learned words"""
        word_id = request.data.get('word_id')
        if not word_id:
            return Response({'error': 'word_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            word = SpanglishWord.objects.get(id=word_id)
            progress, created = UserProgress.objects.get_or_create(user=request.user)
            progress.words_learned.add(word)
            progress.total_score += 10  # Award points for learning a word
            progress.save()
            
            return Response({'message': 'Word added to learned words'})
        except SpanglishWord.DoesNotExist:
            return Response({'error': 'Word not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def add_learned_phrase(self, request):
        """Add a phrase to user's learned phrases"""
        phrase_id = request.data.get('phrase_id')
        if not phrase_id:
            return Response({'error': 'phrase_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            phrase = SpanglishPhrase.objects.get(id=phrase_id)
            progress, created = UserProgress.objects.get_or_create(user=request.user)
            progress.phrases_learned.add(phrase)
            
            # Award points based on difficulty
            points = {'beginner': 15, 'intermediate': 25, 'advanced': 35}
            progress.total_score += points.get(phrase.difficulty_level, 15)
            progress.save()
            
            return Response({'message': 'Phrase added to learned phrases'})
        except SpanglishPhrase.DoesNotExist:
            return Response({'error': 'Phrase not found'}, status=status.HTTP_404_NOT_FOUND)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for User model (read-only)"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'first_name', 'last_name']
