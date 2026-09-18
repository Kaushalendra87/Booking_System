import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";

function App() {
  const [activeSection, setActiveSection] = useState("all");

  const handleNavigate = (section) => {
    setActiveSection(section);
    if (section === "services") {
      const el = document.getElementById("services-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (section === "appointments") {
      const el = document.getElementById("appointments-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="app-layout">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
      <main className="main-content">
        <Dashboard />
      </main>

      <footer className="footer">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} Salon Appointment Booking System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
