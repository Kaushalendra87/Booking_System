import React from "react";
import Loading from "./Loading";

const AppointmentTable = ({
  appointments,
  isLoading,
  selectedStatus,
  onStatusChange,
  onDelete,
  updatingId,
}) => {
  if (isLoading) {
    return <Loading message="Loading appointments..." />;
  }

  if (!appointments || appointments.length === 0) {
    const filterText =
      selectedStatus && selectedStatus !== "all"
        ? `No ${selectedStatus} appointments found.`
        : "No appointments found.";
    return (
      <div className="empty-state">
        <div className="empty-icon">📅</div>
        <h4>{filterText}</h4>
        <p>Book an appointment using the form above.</p>
      </div>
    );
  }

  // Format YYYY-MM-DD date to "20 Sep 2026"
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
        return dateObj.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    } catch (e) {
      // Fallback
    }
    return dateStr;
  };

  // Format HH:MM:SS or HH:MM to 12-hour or clean 24-hour format (e.g. 10:00)
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const parts = timeStr.split(":");
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeStr;
  };

  const getStatusBadgeClass = (status) => {
    switch (status ? status.toLowerCase() : "") {
      case "confirmed":
        return "badge-confirmed";
      case "completed":
        return "badge-completed";
      case "cancelled":
        return "badge-cancelled";
      case "pending":
      default:
        return "badge-pending";
    }
  };

  return (
    <div className="table-responsive">
      <table className="appointment-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Phone</th>
            <th>Service</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr key={apt.id}>
              <td>
                <div className="customer-info">
                  <span className="customer-name">{apt.customer_name}</span>
                  {apt.notes && <span className="customer-notes" title={apt.notes}>📝 {apt.notes}</span>}
                </div>
              </td>
              <td>{apt.customer_phone}</td>
              <td>
                <span className="service-tag">{apt.service_name || `Service #${apt.service}`}</span>
              </td>
              <td>{formatDate(apt.appointment_date)}</td>
              <td>{formatTime(apt.appointment_time)}</td>
              <td>
                <div className="status-select-wrapper">
                  <select
                    className={`status-select ${getStatusBadgeClass(apt.status)}`}
                    value={apt.status || "pending"}
                    onChange={(e) => onStatusChange(apt.id, e.target.value)}
                    disabled={updatingId === apt.id}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => onDelete(apt)}
                  disabled={updatingId === apt.id}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
