from django.core.management.base import BaseCommand
from api.models import LegalService


class Command(BaseCommand):
    help = 'Load initial legal services data'

    def handle(self, *args, **options):
        legal_services = [
            {
                'name': 'Ondernemingsrecht',
                'description': 'Juridische ondersteuning voor ondernemers, van contracten tot geschillen.',
                'icon': 'business'
            },
            {
                'name': 'Familierecht',
                'description': 'Begeleiding bij echtscheiding, alimentatie en omgangsregelingen.',
                'icon': 'family'
            },
            {
                'name': 'Arbeidsrecht',
                'description': 'Advies bij arbeidsconflicten, ontslagen en arbeidsovereenkomsten.',
                'icon': 'work'
            },
            {
                'name': 'Bestuursrecht',
                'description': 'Hulp bij geschillen met overheidsinstanties en bestuurlijke procedures.',
                'icon': 'government'
            },
            {
                'name': 'Verbintenissenrecht',
                'description': 'Contractrecht, aansprakelijkheid en andere verbintenissen tussen partijen.',
                'icon': 'contract'
            }
        ]

        for service_data in legal_services:
            service, created = LegalService.objects.get_or_create(
                name=service_data['name'],
                defaults=service_data
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created legal service: {service.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Legal service already exists: {service.name}')
                )

        self.stdout.write(
            self.style.SUCCESS('Successfully loaded legal services data')
        )