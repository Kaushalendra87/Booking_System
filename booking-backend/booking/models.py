from decimal import Decimal
from django.core.validators import MinValueValidator
from django.db import models

# Create your models here.
class Service(models.Model):

    name = models.CharField(
        max_length=150,
        blank=True,
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[
            MinValueValidator(Decimal("0.01")),
        ],
    )

    duration = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1),
        ],
        help_text="Duration of the service in minutes.",
    )

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["name"]


class Appointment(models.Model):

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    customer_name = models.CharField(max_length=100)

    customer_phone = models.CharField(max_length=20)

    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name="appointments"
    )

    appointment_date = models.DateField()

    appointment_time = models.TimeField()

    notes = models.TextField(
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "service",
                    "appointment_date",
                    "appointment_time",
                ],
                name="unique_service_appointment_slot",
            )
        ]

    def __str_(self):
        return f"{self.customer_name} - {self.service.name} - {self.appointment_date}"