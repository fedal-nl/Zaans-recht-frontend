from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import LegalService, ContactRequest, Appointment
from .serializers import LegalServiceSerializer, ContactRequestSerializer, AppointmentSerializer


class LegalServiceViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for legal services - read only"""
    queryset = LegalService.objects.all()
    serializer_class = LegalServiceSerializer


class ContactRequestViewSet(viewsets.ModelViewSet):
    """API endpoint for contact requests"""
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Contact request submitted successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AppointmentViewSet(viewsets.ModelViewSet):
    """API endpoint for appointment requests"""
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Appointment request submitted successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def api_root(request):
    """API root endpoint providing information about available endpoints"""
    return Response({
        'message': 'Welcome to Zaans Recht API',
        'version': '1.0',
        'endpoints': {
            'legal_services': request.build_absolute_uri('/api/legal-services/'),
            'contact_requests': request.build_absolute_uri('/api/contact-requests/'),
            'appointments': request.build_absolute_uri('/api/appointments/'),
        }
    })
