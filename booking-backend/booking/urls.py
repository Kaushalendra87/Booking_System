from django.urls import path

from .views import (
    ServiceListCreateView,
    ServiceDetailView,
    AppointmentListCreateView,
    AppointmentStatusUpdateView,
    AppointmentDeleteView,
)


urlpatterns = [

    path(
        "services/",
        ServiceListCreateView.as_view(),
        name="service-list-create"
    ),

    path(
        "services/<int:pk>/",
        ServiceDetailView.as_view(),
        name="service-detail"
    ),


    path(
        "appointments/",
        AppointmentListCreateView.as_view(),
        name="appointment-list-create"
    ),

    path(
        "appointments/<int:pk>/status/",
        AppointmentStatusUpdateView.as_view(),
        name="appointment-status-update"
    ),

    path(
        "appointments/<int:pk>/",
        AppointmentDeleteView.as_view(),
        name="appointment-delete"
    ),
]