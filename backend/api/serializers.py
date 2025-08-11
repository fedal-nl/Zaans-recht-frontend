from rest_framework import serializers
from .models import LegalService, ContactRequest, Appointment


class LegalServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalService
        fields = '__all__'


class ContactRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactRequest
        fields = '__all__'
        read_only_fields = ('created_at', 'is_processed')


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('created_at', 'is_confirmed')