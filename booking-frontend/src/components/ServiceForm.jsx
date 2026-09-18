import React, { useState, useEffect } from "react";

const ServiceForm = ({ onSubmit, editingService, onCancelEdit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingService) {
      setFormData({
        name: editingService.name || "",
        price: editingService.price !== undefined ? editingService.price.toString() : "",
        duration: editingService.duration !== undefined ? editingService.duration.toString() : "",
      });
      setErrors({});
    } else {
      setFormData({
        name: "",
        price: "",
        duration: "",
      });
      setErrors({});
    }
  }, [editingService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user edits field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Service name is required.";
    } else if (formData.name.trim().length < 5) {
      newErrors.name = "Service name must contain at least 5 characters.";
    }

    const priceNum = parseFloat(formData.price);
    if (formData.price === "" || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "Price must be a valid number greater than 0.";
    }

    const durationNum = parseInt(formData.duration, 10);
    if (formData.duration === "" || isNaN(durationNum) || durationNum <= 0) {
      newErrors.duration = "Duration must be a valid whole number greater than 0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      price: parseFloat(formData.price).toFixed(2),
      duration: parseInt(formData.duration, 10),
    });
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <h3>{editingService ? "Edit Service" : "Add New Service"}</h3>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="service-name">Service Name *</label>
          <input
            id="service-name"
            type="text"
            name="name"
            placeholder="e.g., Haircut"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "input-error" : ""}
            disabled={isSubmitting}
          />
          {errors.name && <span className="field-error-text">{errors.name}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="service-price">Price (Rs.) *</label>
            <input
              id="service-price"
              type="number"
              name="price"
              step="0.01"
              min="1"
              placeholder="e.g., 500"
              value={formData.price}
              onChange={handleChange}
              className={errors.price ? "input-error" : ""}
              disabled={isSubmitting}
            />
            {errors.price && <span className="field-error-text">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="service-duration">Duration (mins) *</label>
            <input
              id="service-duration"
              type="number"
              name="duration"
              min="1"
              placeholder="e.g., 30"
              value={formData.duration}
              onChange={handleChange}
              className={errors.duration ? "input-error" : ""}
              disabled={isSubmitting}
            />
            {errors.duration && <span className="field-error-text">{errors.duration}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : editingService
              ? "Update Service"
              : "Add Service"}
          </button>
          {editingService && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
