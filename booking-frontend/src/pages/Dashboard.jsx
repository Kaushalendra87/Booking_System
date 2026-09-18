import React, { useState, useEffect, useCallback } from "react";
import ServiceForm from "../components/ServiceForm";
import ServiceList from "../components/ServiceList";
import AppointmentForm from "../components/AppointmentForm";
import AppointmentTable from "../components/AppointmentTable";
import StatusFilter from "../components/StatusFilter";
import ErrorMessage from "../components/ErrorMessage";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  getServices,
  createService,
  updateService,
  deleteService,
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from "../services/api";
import { parseApiError } from "../utils/errorHandler";

const Dashboard = () => {
  // Services state
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormSubmitting, setServiceFormSubmitting] = useState(false);

  // Appointments state
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [appointmentFormSubmitting, setAppointmentFormSubmitting] = useState(false);
  const [bookingApiError, setBookingApiError] = useState(null);
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState(null);

  // Confirmation dialog state
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    type: null, // 'service' | 'appointment'
    item: null,
    isLoading: false,
  });

  // Success toast message
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3500);
  };

  // Fetch services
  const fetchServices = useCallback(async () => {
    setServicesLoading(true);
    setServicesError(null);
    try {
      const data = await getServices();
      setServices(data);
    } catch (err) {
      setServicesError(parseApiError(err, "Unable to load services."));
    } finally {
      setServicesLoading(false);
    }
  }, []);

  // Fetch appointments
  const fetchAppointments = useCallback(async (statusFilter = selectedStatus) => {
    setAppointmentsLoading(true);
    setAppointmentsError(null);
    try {
      const data = await getAppointments(statusFilter);
      setAppointments(data);
    } catch (err) {
      setAppointmentsError(parseApiError(err, "Unable to load appointments."));
    } finally {
      setAppointmentsLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    fetchAppointments(selectedStatus);
  }, [selectedStatus, fetchAppointments]);

  // Handle Service Form Submit (Create / Update)
  const handleServiceSubmit = async (serviceData) => {
    setServiceFormSubmitting(true);
    setServicesError(null);
    try {
      if (editingService) {
        await updateService(editingService.id, serviceData);
        showToast("Service updated successfully.");
        setEditingService(null);
      } else {
        await createService(serviceData);
        showToast("Service created successfully.");
      }
      await fetchServices();
    } catch (err) {
      setServicesError(parseApiError(err, "Failed to save service."));
    } finally {
      setServiceFormSubmitting(false);
    }
  };

  // Handle Edit Service trigger
  const handleEditService = (service) => {
    setEditingService(service);
    // Scroll smoothly to service form
    const el = document.getElementById("services-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Handle Delete Service trigger
  const handleDeleteServiceClick = (service) => {
    setDeleteConfirm({
      isOpen: true,
      type: "service",
      item: service,
      isLoading: false,
    });
  };

  // Handle Delete Appointment trigger
  const handleDeleteAppointmentClick = (appointment) => {
    setDeleteConfirm({
      isOpen: true,
      type: "appointment",
      item: appointment,
      isLoading: false,
    });
  };

  // Confirm Delete Action
  const handleConfirmDelete = async () => {
    const { type, item } = deleteConfirm;
    if (!item) return;

    setDeleteConfirm((prev) => ({ ...prev, isLoading: true }));

    try {
      if (type === "service") {
        await deleteService(item.id);
        showToast("Service deleted successfully.");
        await fetchServices();
      } else if (type === "appointment") {
        await deleteAppointment(item.id);
        showToast("Appointment deleted successfully.");
        await fetchAppointments(selectedStatus);
      }
    } catch (err) {
      const errMsg = parseApiError(err, `Failed to delete ${type}.`);
      if (type === "service") setServicesError(errMsg);
      else setAppointmentsError(errMsg);
    } finally {
      setDeleteConfirm({ isOpen: false, type: null, item: null, isLoading: false });
    }
  };

  // Handle Appointment Booking Submit
  const handleAppointmentSubmit = async (appointmentData, onSuccess) => {
    setAppointmentFormSubmitting(true);
    setBookingApiError(null);
    try {
      await createAppointment(appointmentData);
      showToast("Appointment booked successfully.");
      if (onSuccess) onSuccess();
      await fetchAppointments(selectedStatus);
    } catch (err) {
      setBookingApiError(parseApiError(err, "Appointment could not be created."));
    } finally {
      setAppointmentFormSubmitting(false);
    }
  };

  // Handle Status Update (PATCH)
  const handleStatusChange = async (id, newStatus) => {
    setUpdatingAppointmentId(id);
    try {
      await updateAppointmentStatus(id, newStatus);
      showToast("Appointment status updated successfully.");
      // Update local state directly for fast feedback then refresh
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
      );
      if (selectedStatus !== "all" && selectedStatus !== newStatus) {
        // If filtering by specific status, refresh after status changes
        await fetchAppointments(selectedStatus);
      }
    } catch (err) {
      setAppointmentsError(parseApiError(err, "Failed to update appointment status."));
      await fetchAppointments(selectedStatus);
    } finally {
      setUpdatingAppointmentId(null);
    }
  };

  return (
    <div className="dashboard">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <span>✅ {toastMessage}</span>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title={deleteConfirm.type === "service" ? "Delete Service" : "Delete Appointment"}
        message={
          deleteConfirm.type === "service"
            ? `Are you sure you want to delete service "${deleteConfirm.item?.name}"?`
            : `Are you sure you want to delete the appointment for "${deleteConfirm.item?.customer_name}"?`
        }
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setDeleteConfirm({ isOpen: false, type: null, item: null, isLoading: false })
        }
        isLoading={deleteConfirm.isLoading}
      />

      <div className="dashboard-container">
        {/* Section 1: Services Management */}
        <section id="services-section" className="dashboard-section">
          <div className="section-header">
            <h2>Salon Services</h2>
            <p className="section-subtitle">Manage salon offerings, pricing, and durations</p>
          </div>

          <ErrorMessage
            message={servicesError}
            onDismiss={() => setServicesError(null)}
          />

          <div className="dashboard-grid">
            <div className="grid-col-form">
              <ServiceForm
                onSubmit={handleServiceSubmit}
                editingService={editingService}
                onCancelEdit={() => setEditingService(null)}
                isSubmitting={serviceFormSubmitting}
              />
            </div>
            <div className="grid-col-list">
              <ServiceList
                services={services}
                onEdit={handleEditService}
                onDelete={handleDeleteServiceClick}
                isLoading={servicesLoading}
              />
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* Section 2: Book Appointment */}
        <section id="booking-section" className="dashboard-section">
          <div className="section-header">
            <h2>Book Appointment</h2>
            <p className="section-subtitle">Schedule a service appointment for a customer</p>
          </div>

          <div className="form-container-centered">
            <AppointmentForm
              services={services}
              onSubmit={handleAppointmentSubmit}
              isSubmitting={appointmentFormSubmitting}
              apiError={bookingApiError}
            />
          </div>
        </section>

        <hr className="section-divider" />

        {/* Section 3: Appointments List & Management */}
        <section id="appointments-section" className="dashboard-section">
          <div className="section-header-flex">
            <div>
              <h2>Appointments List</h2>
              <p className="section-subtitle">View and manage customer bookings</p>
            </div>
            <StatusFilter
              selectedStatus={selectedStatus}
              onSelectStatus={(status) => setSelectedStatus(status)}
            />
          </div>

          <ErrorMessage
            message={appointmentsError}
            onDismiss={() => setAppointmentsError(null)}
          />

          <div className="card table-card">
            <AppointmentTable
              appointments={appointments}
              isLoading={appointmentsLoading}
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteAppointmentClick}
              updatingId={updatingAppointmentId}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
