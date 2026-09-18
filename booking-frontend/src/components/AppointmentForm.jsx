import React, { useState } from "react";
import ErrorMessage from "./ErrorMessage";

const AppointmentForm = ({ services, onSubmit, isSubmitting, apiError }) => {
  // Get today's date in YYYY-MM-DD format using local time
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayString();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    service: "",
    appointment_date: todayStr,
    appointment_time: "",
    notes: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.customer_name || !formData.customer_name.trim()) {
      errors.customer_name = "Customer name is required.";
    } else if (formData.customer_name.trim().length < 3) {
      errors.customer_name = "Customer name must contain at least 3 characters.";
    }

    if (!formData.customer_phone || !formData.customer_phone.trim()) {
      errors.customer_phone = "Phone number is required.";
    } else if (!/^\d+$/.test(formData.customer_phone.trim())) {
      errors.customer_phone = "Customer phone must contain only digits.";
    } else if (formData.customer_phone.trim().length < 9 || formData.customer_phone.trim().length > 15) {
      errors.customer_phone = "Customer phone must contain between 9 and 15 digits.";
    }

    if (!formData.service) {
      errors.service = "Please select a service.";
    }

    if (!formData.appointment_date) {
      errors.appointment_date = "Appointment date is required.";
    } else if (formData.appointment_date < todayStr) {
      errors.appointment_date = "Appointment date cannot be in the past.";
    }

    if (!formData.appointment_time) {
      errors.appointment_time = "Appointment time is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      customer_name: formData.customer_name.trim(),
      customer_phone: formData.customer_phone.trim(),
      service: parseInt(formData.service, 10),
      appointment_date: formData.appointment_date,
      appointment_time: formData.appointment_time,
      notes: formData.notes ? formData.notes.trim() : "",
    }, () => {
      // Reset form on success callback
      setFormData({
        customer_name: "",
        customer_phone: "",
        service: "",
        appointment_date: todayStr,
        appointment_time: "",
        notes: "",
      });
      setFieldErrors({});
    });
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <h3>Book Appointment</h3>
      </div>

      <ErrorMessage message={apiError} />

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customer-name">Customer Name *</label>
            <input
              id="customer-name"
              type="text"
              name="customer_name"
              placeholder="e.g., Ram Sharma"
              value={formData.customer_name}
              onChange={handleChange}
              className={fieldErrors.customer_name ? "input-error" : ""}
              disabled={isSubmitting}
            />
            {fieldErrors.customer_name && (
              <span className="field-error-text">{fieldErrors.customer_name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="customer-phone">Phone Number *</label>
            <input
              id="customer-phone"
              type="tel"
              name="customer_phone"
              placeholder="e.g., 9800000000"
              value={formData.customer_phone}
              onChange={handleChange}
              className={fieldErrors.customer_phone ? "input-error" : ""}
              disabled={isSubmitting}
            />
            {fieldErrors.customer_phone && (
              <span className="field-error-text">{fieldErrors.customer_phone}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="appointment-service">Service *</label>
          <select
            id="appointment-service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className={fieldErrors.service ? "input-error" : ""}
            disabled={isSubmitting}
          >
            <option value="">-- Select Service --</option>
            {services && services.length > 0 ? (
              services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - Rs. {parseFloat(s.price).toFixed(2)} ({s.duration} mins)
                </option>
              ))
            ) : (
              <option value="" disabled>
                No services available
              </option>
            )}
          </select>
          {fieldErrors.service && (
            <span className="field-error-text">{fieldErrors.service}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="appointment-date">Appointment Date *</label>
            <input
              id="appointment-date"
              type="date"
              name="appointment_date"
              min={todayStr}
              value={formData.appointment_date}
              onChange={handleChange}
              className={fieldErrors.appointment_date ? "input-error" : ""}
              disabled={isSubmitting}
            />
            {fieldErrors.appointment_date && (
              <span className="field-error-text">{fieldErrors.appointment_date}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="appointment-time">Appointment Time *</label>
            <input
              id="appointment-time"
              type="time"
              name="appointment_time"
              value={formData.appointment_time}
              onChange={handleChange}
              className={fieldErrors.appointment_time ? "input-error" : ""}
              disabled={isSubmitting}
            />
            {fieldErrors.appointment_time && (
              <span className="field-error-text">{fieldErrors.appointment_time}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="appointment-notes">Additional Notes (Optional)</label>
          <textarea
            id="appointment-notes"
            name="notes"
            rows="3"
            placeholder="e.g., Please call before appointment."
            value={formData.notes}
            onChange={handleChange}
            disabled={isSubmitting}
          ></textarea>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !services || services.length === 0}
          >
            {isSubmitting ? "Booking..." : "Book Appointment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
