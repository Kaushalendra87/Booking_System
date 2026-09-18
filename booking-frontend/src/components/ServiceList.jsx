import React from "react";
import Loading from "./Loading";

const ServiceList = ({ services, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return <Loading message="Loading services..." />;
  }

  if (!services || services.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">✂️</div>
        <h4>No services available</h4>
        <p>Add your first service to get started.</p>
      </div>
    );
  }

  return (
    <div className="services-grid">
      {services.map((service) => (
        <div key={service.id} className="service-card">
          <div className="service-header">
            <h4 className="service-title">{service.name}</h4>
            <span className="service-price">Rs. {parseFloat(service.price).toFixed(2)}</span>
          </div>
          <div className="service-body">
            <span className="service-duration">⏱️ {service.duration} mins</span>
          </div>
          <div className="service-actions">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => onEdit(service)}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete(service)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
