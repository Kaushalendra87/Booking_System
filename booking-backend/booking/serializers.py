from django.utils import timezone
from rest_framework import serializers

from .models import Service,Appointment



class ServiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Service
        fields = [
            "id",
            "name",
            "price",
            "duration",
        ]

        read_only_fields = [
            "id",
        ]

        extra_kwargs = {
            "name": {
                "required": True,
                "allow_blank": False,
            },
            "price": {
                "required": True,
            },
            "duration": {
                "required": True,
            },
        }


    def validate_name(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Service name is required."
            )

        if len(value) < 5 :
            raise serializers.ValidationError(
                "Service name must contain at least 5 characters."
            )
        
        return value

    def validate_price(self, value):

        if value <= 0:
            raise serializers.ValidationError(
                "Price must be greater than zero."
            )

        return value

    def validate_duration(self, value):

        if value <= 0:
            raise serializers.ValidationError(
                "Duration must be greater than 0 minutes."
            )

        return value

class AppointmentSerializer(serializers.ModelSerializer):

    service_name = serializers.CharField(
        source="service.name",
        read_only=True
    )

    class Meta:
        model = Appointment

        fields = [
            "id",
            "customer_name",
            "customer_phone",
            "service",
            "service_name",
            "appointment_date",
            "appointment_time",
            "notes",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "service_name",
            "status",
            "created_at",
            "updated_at",
        ]

    def validate_customer_name(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Customer name is required."
            )

        if len(value) < 3:
            raise serializers.ValidationError(
                "Customer name must contain at least 3 characters."
            )

        return value

    def validate_customer_phone(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Customer phone is required."
            )

        if not value.isdigit():
            raise serializers.ValidationError(
                "Customer phone must contain only digits."
            )

        if len(value) < 9 or len(value) > 15:
            raise serializers.ValidationError(
                "Customer phone must contain between 9 and 15 digits."
            )

        return value

    def validate_service(self, value):
        if not Service.objects.filter(id=value.id).exists():
            raise serializers.ValidationError(
                "Selected service does not exist."
            )

        return value

    def validate_appointment_date(self, value):
        today = timezone.localdate()

        if value < today:
            raise serializers.ValidationError(
                "Appointment date cannot be in the past."
            )

        return value

    def validate(self, attrs):
        service = attrs.get("service")
        appointment_date = attrs.get("appointment_date")
        appointment_time = attrs.get("appointment_time")

        if service and appointment_date and appointment_time:

            existing_appointment = Appointment.objects.filter(
                service=service,
                appointment_date=appointment_date,
                appointment_time=appointment_time,
            )

            # Important for future PUT/PATCH operations
            if self.instance:
                existing_appointment = existing_appointment.exclude(
                    id=self.instance.id
                )

            if existing_appointment.exists():
                raise serializers.ValidationError({
                    "appointment_time": (
                        "This service is already booked "
                        "for the selected date and time."
                    )
                })

        return attrs

class AppointmentStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = Appointment

        fields = ["status"]