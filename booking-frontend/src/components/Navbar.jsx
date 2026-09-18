import React from "react";

const Navbar = ({ activeSection, onNavigate }) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="navbar-logo-icon">✂️</span>
          <span className="navbar-title">Salon Appointment Booking</span>
        </div>
        <nav className="navbar-nav">
          <button
            type="button"
            className={`nav-link ${activeSection === "all" ? "active" : ""}`}
            onClick={() => onNavigate && onNavigate("all")}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`nav-link ${activeSection === "services" ? "active" : ""}`}
            onClick={() => onNavigate && onNavigate("services")}
          >
            Services
          </button>
          <button
            type="button"
            className={`nav-link ${activeSection === "appointments" ? "active" : ""}`}
            onClick={() => onNavigate && onNavigate("appointments")}
          >
            Appointments
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
