from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'words', views.SpanglishWordViewSet)
router.register(r'phrases', views.SpanglishPhraseViewSet)
router.register(r'progress', views.UserProgressViewSet)
router.register(r'users', views.UserViewSet)

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('api/', include(router.urls)),
]