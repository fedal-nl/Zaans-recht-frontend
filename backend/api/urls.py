from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'legal-services', views.LegalServiceViewSet)
router.register(r'contact-requests', views.ContactRequestViewSet)
router.register(r'appointments', views.AppointmentViewSet)

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('', include(router.urls)),
]