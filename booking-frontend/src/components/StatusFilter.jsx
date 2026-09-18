import React from "react";

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const StatusFilter = ({ selectedStatus, onSelectStatus }) => {
  return (
    <div className="status-filter-container">
      <span className="filter-label">Filter by Status:</span>
      <div className="filter-pills">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`filter-pill ${selectedStatus === opt.value ? "active" : ""} status-${opt.value}`}
            onClick={() => onSelectStatus(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter;
