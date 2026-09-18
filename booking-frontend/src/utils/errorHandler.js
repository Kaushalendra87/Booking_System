/**
 * Formats API response errors into user-friendly strings or field error maps.
 */

export const parseApiError = (error, defaultFallback = "An unexpected error occurred.") => {
  if (!error) return defaultFallback;

  // Network error or server unreachable
  if (!error.response) {
    if (error.message === "Network Error") {
      return "Unable to connect to the backend server. Please check if the backend is running at http://127.0.0.1:8000.";
    }
    return error.message || defaultFallback;
  }

  const { status, data } = error.response;

  // Server error statuses
  if (status >= 500) {
    return "Server error (500). Please try again later or contact system administrator.";
  }

  if (status === 404) {
    return "The requested resource was not found (404).";
  }

  // Parse DRF validation errors (400 Bad Request)
  if (data) {
    // If backend returns detail string
    if (typeof data === "string") {
      return data;
    }

    if (data.detail && typeof data.detail === "string") {
      return data.detail;
    }

    // Check specific field errors
    const messages = [];

    // Duplicate booking or specific field array messages
    for (const [field, val] of Object.entries(data)) {
      const fieldNameFormatted = field
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      if (Array.isArray(val)) {
        const msgStr = val.join(" ");
        // Special friendly wording for duplicate booking error (both serializer validation & model unique constraint)
        if (
          msgStr.includes("already booked") ||
          msgStr.includes("unique set") ||
          msgStr.includes("unique_service_appointment_slot")
        ) {
          return "This service is already booked for the selected date and time. Please choose another time.";
        } else if (field === "non_field_errors") {
          messages.push(msgStr);
        } else {
          messages.push(`${fieldNameFormatted}: ${msgStr}`);
        }
      } else if (typeof val === "string") {
        if (
          val.includes("already booked") ||
          val.includes("unique set") ||
          val.includes("unique_service_appointment_slot")
        ) {
          return "This service is already booked for the selected date and time. Please choose another time.";
        }
        messages.push(`${fieldNameFormatted}: ${val}`);
      }
    }

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  return defaultFallback;
};

export const extractFieldErrors = (error) => {
  if (!error || !error.response || !error.response.data || typeof error.response.data !== "object") {
    return {};
  }

  const fieldErrors = {};
  const data = error.response.data;

  for (const [key, val] of Object.entries(data)) {
    if (Array.isArray(val)) {
      fieldErrors[key] = val.join(" ");
    } else if (typeof val === "string") {
      fieldErrors[key] = val;
    }
  }

  return fieldErrors;
};
