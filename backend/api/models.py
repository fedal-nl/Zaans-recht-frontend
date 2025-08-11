from django.db import models
from django.contrib.auth.models import User


class LegalService(models.Model):
    """Model for legal services offered"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='legal')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class ContactRequest(models.Model):
    """Model for contact form submissions"""
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_processed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.subject}"


class Appointment(models.Model):
    """Model for appointment requests"""
    APPOINTMENT_TYPES = [
        ('kantoor', 'Kantoorbezoek'),
        ('videobellen', 'Videobellen'),
    ]
    
    LEGAL_AREAS = [
        ('ondernemingsrecht', 'Ondernemingsrecht'),
        ('familierecht', 'Familierecht'),
        ('arbeidsrecht', 'Arbeidsrecht'),
        ('bestuursrecht', 'Bestuursrecht'),
        ('verbintenissenrecht', 'Verbintenissenrecht'),
        ('overig', 'Overig'),
    ]

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    legal_area = models.CharField(max_length=50, choices=LEGAL_AREAS)
    appointment_type = models.CharField(max_length=20, choices=APPOINTMENT_TYPES)
    preferred_date = models.DateField()
    preferred_time = models.TimeField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_confirmed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.preferred_date}"
