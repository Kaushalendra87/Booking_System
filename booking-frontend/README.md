# Salon Appointment Booking System

A full-stack, responsive web application for managing salon services and customer appointment bookings. Built with a **Django REST Framework** backend, a **React.js + Vite** frontend, and **SQLite** database storage.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Project Structure](#-project-structure)
3. [System Architecture & Data Flow](#-system-architecture--data-flow)
4. [Backend API Documentation](#-backend-api-documentation)
5. [Database & Data Models](#-database--data-models)
6. [Business Rules & Validation](#-business-rules--validation)
7. [Frontend Implementation](#-frontend-implementation)
8. [CORS Configuration](#-cors-configuration)
9. [Installation & Setup Guide](#-installation--setup-guide)
10. [Quick Start (Running the App)](#-quick-start-running-the-app)
11. [Sample Data](#-sample-data)
12. [Key Technical Decisions](#-key-technical-decisions)
13. [Manual Testing Checklist](#-manual-testing-checklist)
14. [Assessment Requirements Alignment](#-assessment-requirements-alignment)
15. [Scope Exclusions](#-scope-exclusions)

---

## 🎯 Project Overview

This project was developed as a Full-Stack coding assessment. It provides an end-to-end appointment booking platform for salon operations:

- **Service Management**: Salon managers can create, view, update, and delete service offerings (Name, Price, Duration).
- **Appointment Booking**: Customers/staff can schedule appointments by selecting a service, appointment date, time slot, and providing customer details.
- **Status Workflow**: Appointments are created with a default `pending` status and can transition to `confirmed`, `completed`, or `cancelled`.
- **Duplicate Slot Prevention**: The system strictly prevents multiple bookings for the same service at the exact same date and time slot.
- **Status Filtering**: Appointments can be dynamically filtered by status (`All`, `Pending`, `Confirmed`, `Completed`, `Cancelled`) via backend API queries.
- **Responsive UI**: Accessible single-page interface with clear feedback toasts, modal dialogs, loading spinners, and error banners.

---

## 📁 Project Structure

The project is organized into two primary directories: `booking-backend` (Django REST API) and `booking-frontend` (React SPA).

```text
Booking/
├── booking-backend/
│   ├── manage.py
│   ├── db.sqlite3
│   ├── requirements.txt
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py           # Project settings, CORS & DRF configuration
│   │   ├── urls.py               # Main URL routing (/api/ include)
│   │   └── wsgi.py
│   └── booking/
│       ├── migrations/           # Database migration files
│       ├── __init__.py
│       ├── admin.py              # Django Admin model registrations
│       ├── apps.py
│       ├── models.py             # Service & Appointment ORM models
│       ├── serializers.py        # DRF serializers & field validations
│       ├── views.py              # Class-based APIView endpoints
│       └── urls.py               # API route definitions
│
└── booking-frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx           # Top header navigation
    │   │   ├── ServiceForm.jsx      # Add & Edit service form
    │   │   ├── ServiceList.jsx      # Render service cards with actions
    │   │   ├── AppointmentForm.jsx  # Booking form with service dropdown
    │   │   ├── AppointmentTable.jsx # Appointments table with status select
    │   │   ├── StatusFilter.jsx     # Status filter pill controls
    │   │   ├── Loading.jsx          # Reusable loading spinner
    │   │   ├── ErrorMessage.jsx     # Inline error banner component
    │   │   └── ConfirmDialog.jsx    # Modal dialog for delete operations
    │   ├── pages/
    │   │   └── Dashboard.jsx        # Main unified dashboard coordinating state
    │   ├── services/
    │   │   └── api.js               # Centralized Axios instance & API wrapper
    │   ├── utils/
    │   │   └── errorHandler.js      # DRF validation & error parsing utility
    │   ├── App.jsx                  # Main application shell
    │   ├── main.jsx                 # Vite React entry point
    │   └── index.css                # Custom CSS styling & design tokens
    ├── .env                         # VITE_API_BASE_URL=http://127.0.0.1:8000/api
    ├── .gitignore
    ├── index.html
    ├── package.json
    └── README.md
```

### Key File Responsibilities

| File | Responsibility |
| :--- | :--- |
| `booking/models.py` | Defines database schema for `Service` and `Appointment` models, including foreign keys and unique constraints. |
| `booking/serializers.py` | Validates incoming payloads, computes `service_name` display field, and validates business rules. |
| `booking/views.py` | Encapsulates REST endpoint logic using DRF `APIView` classes for services, appointments, status updates, and status filtering. |
| `src/services/api.js` | Centralizes Axios API requests using `VITE_API_BASE_URL` to separate HTTP network logic from React components. |
| `src/utils/errorHandler.js` | Parses DRF response errors and translates duplicate slot conflicts into clear user messages. |
| `src/pages/Dashboard.jsx` | Coordinates shared application state, handles API data fetching, and displays success notifications. |

---

## 🏗️ System Architecture & Data Flow

```text
+-------------------------------------------------------------+
|                      React.js Frontend                      |
| (UI Components: Forms, Tables, Status Filters, Cards)       |
+------------------------------+------------------------------+
                               |
                               | Axios HTTP Calls
                               v
+-------------------------------------------------------------+
|                 Centralized API Layer (api.js)               |
|                 VITE_API_BASE_URL=.../api                   |
+------------------------------+------------------------------+
                               |
                               | JSON Requests / Responses
                               v
+-------------------------------------------------------------+
|                Django REST Framework (Backend)              |
| (APIView Routes: /api/services/, /api/appointments/)        |
+------------------------------+------------------------------+
                               |
                               | Validation & Serializations
                               v
+-------------------------------------------------------------+
|                Django Models & Business Logic               |
| (UniqueConstraints, ForeignKeys, Field Validators)          |
+------------------------------+------------------------------+
                               |
                               | SQL Queries
                               v
+-------------------------------------------------------------+
|                       SQLite Database                       |
| (db.sqlite3: booking_service, booking_appointment)          |
+-------------------------------------------------------------+
```

### Layer Responsibilities

1. **React UI**: Renders forms, interactive cards, status badges, modal dialogs, and error alerts.
2. **Axios API Layer**: Manages base URLs, request headers, error handling, and asynchronous API wrapper functions.
3. **Django REST Framework**: Provides HTTP verb handlers (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`), serializes models to JSON, and validates request payloads.
4. **Django Models & ORM**: Enforces entity integrity, relational constraints (`CASCADE`), and duplicate booking constraints.
5. **SQLite**: Provides lightweight, zero-configuration local database persistence.

---

## 🔌 Backend API Documentation

**Base API URL**: `http://127.0.0.1:8000/api`

### Endpoints Summary

| HTTP Method | Endpoint | Purpose | Request Body | Success Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/services/` | Fetch all services | None | `200 OK` |
| `POST` | `/api/services/` | Create a new service | `{ name, price, duration }` | `201 Created` |
| `PUT` | `/api/services/<id>/` | Update an existing service | `{ name, price, duration }` | `200 OK` |
| `DELETE` | `/api/services/<id>/` | Delete a service | None | `204 No Content` |
| `GET` | `/api/appointments/` | Fetch all appointments | None | `200 OK` |
| `GET` | `/api/appointments/?status=<status>` | Filter appointments by status | None | `200 OK` |
| `POST` | `/api/appointments/` | Book a new appointment | `{ customer_name, customer_phone, service, appointment_date, appointment_time, notes }` | `201 Created` |
| `PATCH` | `/api/appointments/<id>/status/` | Update appointment status | `{ status }` | `200 OK` |
| `DELETE` | `/api/appointments/<id>/` | Delete an appointment | None | `204 No Content` |

---

### Request & Response Examples

#### 1. Create Service (`POST /api/services/`)

**Request Payload**:
```json
{
  "name": "Haircut",
  "price": 500.00,
  "duration": 30
}
```

**Response (`201 Created`)**:
```json
{
  "id": 1,
  "name": "Haircut",
  "price": "500.00",
  "duration": 30
}
```

---

#### 2. Create Appointment (`POST /api/appointments/`)

> **Note**: Do **NOT** send `status` in the create payload. The backend automatically sets new appointments to `pending`.

**Request Payload**:
```json
{
  "customer_name": "Ram Sharma",
  "customer_phone": "9800000000",
  "service": 1,
  "appointment_date": "2026-09-25",
  "appointment_time": "10:00",
  "notes": "Please use minimal styling products."
}
```

**Response (`201 Created`)**:
```json
{
  "id": 1,
  "customer_name": "Ram Sharma",
  "customer_phone": "9800000000",
  "service": 1,
  "service_name": "Haircut",
  "appointment_date": "2026-09-25",
  "appointment_time": "10:00:00",
  "notes": "Please use minimal styling products.",
  "status": "pending",
  "created_at": "2026-09-18T10:00:00Z",
  "updated_at": "2026-09-18T10:00:00Z"
}
```

---

#### 3. Update Appointment Status (`PATCH /api/appointments/<id>/status/`)

**Request Payload**:
```json
{
  "status": "confirmed"
}
```

**Response (`200 OK`)**:
```json
{
  "id": 1,
  "customer_name": "Ram Sharma",
  "customer_phone": "9800000000",
  "service": 1,
  "service_name": "Haircut",
  "appointment_date": "2026-09-25",
  "appointment_time": "10:00:00",
  "notes": "Please use minimal styling products.",
  "status": "confirmed",
  "created_at": "2026-09-18T10:00:00Z",
  "updated_at": "2026-09-18T10:05:00Z"
}
```

---

### HTTP Status Codes

| Code | Status | Description |
| :--- | :--- | :--- |
| `200` | OK | Request succeeded (e.g. GET list, PUT service update, PATCH status update). |
| `201` | Created | Resource created successfully (e.g. POST service, POST appointment). |
| `204` | No Content | Resource deleted successfully (e.g. DELETE service, DELETE appointment). |
| `400` | Bad Request | Validation failure or duplicate slot booking attempt. Returns error JSON object. |
| `404` | Not Found | Requested resource ID does not exist in the database. |

---

## 🗄️ Database & Data Models

The database is an **SQLite** database located at `booking-backend/db.sqlite3`.

### ER Diagram & Relationship

```text
+-----------------------+              +-----------------------------------+
|        Service        |              |            Appointment            |
+-----------------------+              +-----------------------------------+
| id (PK)               | 1          * | id (PK)                           |
| name                  |<------------ | customer_name                     |
| price                 |   (CASCADE)  | customer_phone                    |
| duration              |              | service (FK -> Service.id)        |
+-----------------------+              | appointment_date                  |
                                       | appointment_time                  |
                                       | notes                             |
                                       | status                            |
                                       | created_at                        |
                                       | updated_at                        |
                                       +-----------------------------------+
```

### Models Detail

#### 1. Service Model (`booking_service`)
- `id` (AutoField, Primary Key)
- `name` (CharField, max_length=150)
- `price` (DecimalField, max_digits=10, decimal_places=2, MinValueValidator=0.01)
- `duration` (PositiveIntegerField, in minutes, MinValueValidator=1)

#### 2. Appointment Model (`booking_appointment`)
- `id` (AutoField, Primary Key)
- `customer_name` (CharField, max_length=100)
- `customer_phone` (CharField, max_length=20)
- `service` (ForeignKey -> Service, on_delete=models.CASCADE, related_name="appointments")
- `appointment_date` (DateField)
- `appointment_time` (TimeField)
- `notes` (TextField, optional, blank=True, null=True)
- `status` (CharField, choices: `pending`, `confirmed`, `completed`, `cancelled`, default: `pending`)
- `created_at` (DateTimeField, auto_now_add=True)
- `updated_at` (DateTimeField, auto_now=True)

#### Database Constraints
- **Unique Constraint**: `unique_service_appointment_slot` on `(service, appointment_date, appointment_time)` prevents double-booking a service slot.
- **CASCADE Delete**: Deleting a `Service` automatically deletes all associated `Appointment` records.

---

## ⚖️ Business Rules & Validation

### Service Rules
1. `name`: Required, non-empty, minimum 5 characters (enforced by backend serializer and frontend form).
2. `price`: Required, numeric, strictly greater than `0`.
3. `duration`: Required, positive integer greater than `0` minutes.

### Appointment Rules
1. `customer_name`: Required, minimum 3 characters.
2. `customer_phone`: Required, strictly digits only, length between 9 and 15 digits.
3. `service`: Required, must be a valid existing Service ID integer.
4. `appointment_date`: Required, cannot be in the past (minimum date set to current local browser date).
5. `appointment_time`: Required, formatted as `HH:MM`.
6. `notes`: Optional string.
7. `status`: Defaults automatically to `pending` upon creation.

### Duplicate Booking Rule
The system prevents duplicate bookings for the exact same combination of:
$$\text{Service} + \text{Appointment Date} + \text{Appointment Time}$$

- **Example**: If `Haircut` is booked for `2026-09-25` at `10:00`, attempting to book `Haircut` for `2026-09-25` at `10:00` again will fail.
- **Allowed**: Booking `Facial` for `2026-09-25` at `10:00` (different service) **is allowed**.
- **Error Handling**: When a duplicate booking is attempted, the backend returns a `400 Bad Request`. The frontend intercepts this error and displays:
  > *"This service is already booked for the selected date and time. Please choose another time."*

---

## 💻 Frontend Implementation

The frontend is built as a Single Page Application (SPA) using **React.js + Vite**.

### Environment Setup

File: `booking-frontend/.env`
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```
> **Note**: Environment variables in Vite applications must use the `VITE_` prefix to be exposed to client-side code via `import.meta.env`.

### Key Features
- **Centralized API Layer**: All requests route through `src/services/api.js`.
- **Dynamic Service Dropdown**: Populates options using service IDs as payload values and displays names with prices.
- **Date Min Constraint**: Dynamically sets `<input type="date" min={todayStr}>` to prevent selecting past dates.
- **Status Badges & Selector**: Status choices (`Pending`, `Confirmed`, `Completed`, `Cancelled`) render with distinct color badges and an inline `<select>` control for instant status updates (`PATCH`).
- **Server-Side Status Filtering**: Status filter pills (`All`, `Pending`, `Confirmed`, `Completed`, `Cancelled`) execute filtered API requests (`/api/appointments/?status=...`).
- **Delete Confirmation Modal**: Service and appointment deletions trigger a modal prompt before dispatching `DELETE` requests.
- **Toast Feedback & Alerts**: Non-blocking toast notifications appear for successful CRUD actions and auto-dismiss after 3.5 seconds.

---

## 🌐 CORS Configuration

The Django backend is configured using `django-cors-headers` to allow requests from the React/Vite development server origins:

File: `booking-backend/config/settings.py`
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

---

## ⚙️ Installation & Setup Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and `npm`

---

### Backend Setup (`booking-backend`)

1. Navigate to the backend directory:
   ```bash
   cd booking-backend
   ```

2. Create a virtual environment:
   - **Linux / macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
   - **Windows**:
     ```cmd
     python -m venv venv
     venv\Scripts\activate
     ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *(Required packages: `django`, `djangorestframework`, `django-cors-headers`)*

4. Apply database migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. *(Optional)* Create a Django superuser for admin access:
   ```bash
   python manage.py createsuperuser
   ```

6. Start the Django development server:
   ```bash
   python manage.py runserver 8000
   ```
   Backend API is available at: `http://127.0.0.1:8000/api/`
   Django Admin is available at: `http://127.0.0.1:8000/admin/`

---

### Frontend Setup (`booking-frontend`)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd booking-frontend
   ```

2. Install Node packages:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Frontend application will run at: `http://localhost:5173/`

---

## 🚀 Quick Start (Running the App)

Run the system using two terminal sessions:

### Terminal 1 (Backend)
```bash
cd booking-backend
source venv/bin/activate   # On Windows: venv\Scripts\activate
python manage.py runserver 8000
```

### Terminal 2 (Frontend)
```bash
cd booking-frontend
npm run dev
```

Open `http://localhost:5173/` in your browser.

---

## 🧪 Sample Data

Sample services can be added manually through the React frontend UI or Django Admin:

| Service Name | Price (Rs.) | Duration |
| :--- | :--- | :--- |
| `Haircut` | `500.00` | `30 mins` |
| `Facial` | `1000.00` | `60 mins` |
| `Hair Coloring` | `2500.00` | `120 mins` |

> *Note: Sample data is added manually; no automatic database seeding script is required.*

---

## 💡 Key Technical Decisions

1. **Django REST Framework**: Chosen for robust serialization, class-based APIViews, built-in validation, and standard HTTP response status handling.
2. **APIView Classes**: Explicit control over HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) without unnecessary overhead.
3. **Database-level UniqueConstraint**: Dual-layer duplicate slot protection enforced at both serializer level and database engine level.
4. **SQLite Database**: Lightweight, file-based SQL database suitable for local development and technical evaluations.
5. **Single `booking` Django App**: Kept project structure minimal and clean without over-engineering multiple apps for a single domain.
6. **Centralized Axios API Layer (`api.js`)**: Encapsulates all backend URL paths and request logic, avoiding scattered `axios` calls across components.
7. **No Redux / Heavy State Libraries**: Utilized React's built-in `useState` and `useEffect` hooks for clear state management appropriate for the project scope.
8. **Responsive Vanilla CSS**: Styled with modern CSS custom properties, flexbox, grid, and dark/light accents without external UI frameworks.

---

## 🧪 Manual Testing Checklist

### Services
- [x] Create service with valid details (Name, Price > 0, Duration > 0).
- [x] Reject blank or short (< 5 chars) service name.
- [x] Reject zero or negative price.
- [x] Edit service and verify updated values reflect in the UI.
- [x] Delete service via confirm modal and verify deletion.

### Appointments
- [x] Service dropdown populates dynamically from GET `/api/services/`.
- [x] Reject missing customer name, invalid phone (< 9 digits or non-digits), or past date.
- [x] Create appointment and verify it appears with `Pending` status.
- [x] **Duplicate Booking Test**: Attempt booking same service + date + time -> Verify clear duplicate error message appears.
- [x] **Slot Overlap Test**: Book different service at same date + time -> Verify creation succeeds.
- [x] Update appointment status (`Pending` -> `Confirmed` -> `Completed` / `Cancelled`) via dropdown.
- [x] Filter appointments using status pills (`All`, `Pending`, `Confirmed`, `Completed`, `Cancelled`).
- [x] Delete appointment via confirm modal and verify removal.

### UI / UX
- [x] Verify loading spinners while fetching data.
- [x] Verify inline field validation errors and top error banners.
- [x] Verify empty states when lists or filters return no records.
- [x] Verify success toast notifications auto-dismiss.
- [x] Verify responsive layout on desktop and mobile screens.

---

## 🎯 Assessment Requirements Alignment

| Requirement | Implementation Status |
| :--- | :--- |
| **Services CRUD** | Fully supported (`GET`, `POST`, `PUT`, `DELETE`). |
| **Appointment Booking** | Fully supported (`POST` with service ID payload). |
| **Status Updates** | Fully supported (`PATCH` status endpoint with choices `pending`, `confirmed`, `completed`, `cancelled`). |
| **Status Filtering** | Fully supported via backend query parameters (`?status=...`). |
| **Duplicate Booking Protection** | Enforced at serializer and database level with clear error UI feedback. |
| **Validation Rules** | Enforced on both frontend forms and backend serializers. |
| **Persistent Storage** | Managed via SQLite database (`db.sqlite3`). |
| **React SPA Frontend** | Built with React + Vite + Axios + CSS. |

---

## 🚫 Scope Exclusions

The following features were explicitly outside the scope of this assignment and are intentionally **not** included:
- User authentication / login / JWT tokens
- Online payment gateway integration
- SMS / Email automated notifications
- Multi-tenant staff management
- Complex calendar UI views
