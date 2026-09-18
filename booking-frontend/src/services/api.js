import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Services API calls
export const getServices = async () => {
  const response = await api.get("/services/");
  return response.data;
};

export const createService = async (serviceData) => {
  const response = await api.post("/services/", serviceData);
  return response.data;
};

export const updateService = async (id, serviceData) => {
  const response = await api.put(`/services/${id}/`, serviceData);
  return response.data;
};

export const deleteService = async (id) => {
  const response = await api.delete(`/services/${id}/`);
  return response.data;
};

// Appointments API calls
export const getAppointments = async (status = "") => {
  const url = status && status !== "all" ? `/appointments/?status=${encodeURIComponent(status)}` : "/appointments/";
  const response = await api.get(url);
  return response.data;
};

export const createAppointment = async (appointmentData) => {
  const response = await api.post("/appointments/", appointmentData);
  return response.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const response = await api.patch(`/appointments/${id}/status/`, { status });
  return response.data;
};

export const deleteAppointment = async (id) => {
  const response = await api.delete(`/appointments/${id}/`);
  return response.data;
};

export default api;
