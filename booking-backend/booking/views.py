from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Appointment, Service
from .serializers import (
    AppointmentSerializer,
    AppointmentStatusSerializer,
    ServiceSerializer,
)


class ServiceListCreateView(APIView):
    """
    GET:
        Return all services.
    POST:
        Create a new service.
    """

    def get(self, request):
        services = Service.objects.all().order_by("name")
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ServiceSerializer(data=request.data)
        if serializer.is_valid():
            service = serializer.save()
            return Response(
                ServiceSerializer(service).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ServiceDetailView(APIView):
    """
    GET:
        Retrieve a single service.
    PUT:
        Update an existing service.
    DELETE:
        Delete an existing service.
    """

    def get_object(self, pk):
        try:
            return Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            return None

    def get(self, request, pk):
        service = self.get_object(pk)
        if service is None:
            return Response(
                {"detail": "Service not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = ServiceSerializer(service)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        service = self.get_object(pk)
        if service is None:
            return Response(
                {"detail": "Service not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ServiceSerializer(service, data=request.data)
        if serializer.is_valid():
            service = serializer.save()
            return Response(
                ServiceSerializer(service).data,
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        service = self.get_object(pk)
        if service is None:
            return Response(
                {"detail": "Service not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AppointmentListCreateView(APIView):
    """
    GET:
        Return all appointments with optional status filtering.
    POST:
        Create a new appointment.
    """

    def get(self, request):
        appointments = (
            Appointment.objects.select_related("service")
            .all()
            .order_by("appointment_date", "appointment_time")
        )

        appointment_status = request.query_params.get("status")
        if appointment_status:
            # Safely extract valid choice values from model field metadata
            try:
                choices = Appointment._meta.get_field("status").choices
                valid_statuses = [choice[0] for choice in choices]
            except AttributeError:
                valid_statuses = [choice[0] for choice in Appointment.Status.choices]

            if appointment_status not in valid_statuses:
                choices_str = ", ".join(valid_statuses)
                return Response(
                    {"detail": f"Invalid status. Choose from: {choices_str}."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            appointments = appointments.filter(status=appointment_status)

        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            appointment = serializer.save()
            return Response(
                AppointmentSerializer(appointment).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AppointmentStatusUpdateView(APIView):
    """
    PATCH:
        Update appointment status.
    """

    def get_object(self, pk):
        try:
            return Appointment.objects.get(pk=pk)
        except Appointment.DoesNotExist:
            return None

    def patch(self, request, pk):
        appointment = self.get_object(pk)
        if appointment is None:
            return Response(
                {"detail": "Appointment not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AppointmentStatusSerializer(
            appointment, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                AppointmentSerializer(appointment).data,
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AppointmentDeleteView(APIView):
    """
    DELETE:
        Delete an appointment.
    """

    def delete(self, request, pk):
        try:
            appointment = Appointment.objects.get(pk=pk)
        except Appointment.DoesNotExist:
            return Response(
                {"detail": "Appointment not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        appointment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)