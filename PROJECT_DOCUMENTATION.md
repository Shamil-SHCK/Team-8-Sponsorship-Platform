# Sponsorship Platform - Project Documentation

## 1. Project Overview
**Name**: Team-8 Sponsorship Platform
**Description**: A crowdfunding and sponsorship platform connecting students/alumni with clubs and companies.
**Tech Stack**:
- **Frontend**: React (Vite), CSS Modules/Vanilla CSS (Clean Enterprise Theme)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs

---

---

## 2. Directory Structure
The project is organized into two main workspaces:
- **`frontend/`**: Contains the React + Vite application.
    - **`components/`**: Reusable UI parts (e.g., `AdminPanel`, `LandingPage`).
    - **`services/`**: API handling logic.
- **`backend/server/`**: Contains the Node.js + Express backend API.
    - **`uploads/`**: Stores user-uploaded verification documents (Ignored by Git).
- **`package.json`**: Root configuration to run both services simultaneously.

> **Note**: A `.gitignore` file is placed in the root to ensure `node_modules`, `.env`, and logs are not committed to version control.

---

## 3. Key Features & Implementation Status

### A. Authentication & User Roles
**Status**: ✅ Complete
- **Roles**: `administrator`, `club-admin`, `company`, `alumni-individual`.
- **Flow**:
    - **Landing Page**: New entry point at `/` with options to Login or Register.
    - **Login Redirection**:
        - `administrator` -> `/dashboard` (with embedded Admin Panel).
        - `company` -> `/company-dashboard`.
        - `club-admin` -> `/club-dashboard`.
        - `alumni-individual` -> `/alumni-dashboard`.
    - **Protection**: `ProtectedRoute` checks for token AND `allowedRoles` to prevent unauthorized access.

### B. Dashboard & "Waiting Room"
**Status**: ✅ Complete
- **Logic**:
    - **Pending**: "Application Under Review" screen.
    - **Rejected**: "Application Rejected" screen.
    - **Verified**: Main dashboard content.
- **Role Integration**: The `Dashboard.jsx` serves as the container for all roles but renders specific content based on the user type.
    - **Admins**: See the `AdminPanel` embedded directly within their dashboard.

### C. Profile Management
**Status**: ✅ Complete
- **Feature**: Users can edit their details (Phone, Logo, Bio, Organization Name).
- **Password Change**: Users can securely change their passwords.

### D. Admin Panel
**Status**: ✅ Complete
- **Access**: Strictly restricted to users with `role: 'administrator'`.
- **Integration**: Now acts as both a standalone component or an embedded widget within the Dashboard.
- **Features**: 
    1.  **View Pending/All Users**: List and filter users.
    2.  **Document Viewer (New)**: Modal to view/zoom verification documents (Images & PDFs) directly in the app.
    3.  **Approve/Reject**: Update user verification status.
    4.  **Password Reset**: Admin can forced-reset any user's password to `ChangeMe@123`.

---

## 4. API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user & get Token | No |
| GET | `/me` | Get current user details | Yes |
| PUT | `/profile` | Update user profile | Yes |
| PUT | `/password` | Change user password | Yes |

### Admin (`/api/admin`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/users/pending` | Get users with pending status | Admin Only |
| GET | `/users` | Get ALL users | Admin Only |
| PUT | `/verify/:userId`| Update status (verified/rejected)| Admin Only |
| PUT | `/users/:userId/reset-password` | Set password to 'ChangeMe@123' | Admin Only |

---

## 5. Frontend Structure (`frontend/src`)
- **`components/`**:
    - `LandingPage.jsx`: Main entry point with platform branding.
    - `Login.jsx` / `Register.jsx`: Auth forms with "Clean Enterprise" styling.
    - `Dashboard.jsx`: Role-agnostic container that adapts content based on user role.
    - `Profile.jsx`: User settings and Password Update form.
    - `AdminPanel.jsx`: Management interface with Document Viewer Modal.
- **`services/`**:
    - `api.js`: Centralized fetch wrappers for all backend calls.
- **`App.jsx`**: Routing definition with `ProtectedRoute` ensuring RBAC.

---

## 6. Architecture & Deployment (New)

### Database Hosting
- **MongoDB Atlas**: Recommended for cloud database hosting.

### Backend Hosting
- **Cannot use GitHub Pages**: Node.js backends require dynamic server execution.
- **Recommended**: Render, Railway, or Vercel (serverless adaptation).

### Frontend Hosting
- **GitHub Pages**: Fully supported for the React/Vite frontend.

### Future Folder Structure
As the project scales, we will adopt:
- **`frontend/src/pages/`**: For full page views (e.g., `Home.jsx`, `Events.jsx`).
- **`frontend/src/components/`**: Strictly for reusable, small UI widgets (Buttons, Cards).

## 6. How to Run

The project is configured with `concurrently` to run both the frontend and backend with a single command from the root directory.

### Prerequisites
- Node.js & npm installed.
- MongoDB Atlas URI or local MongoDB connection string.

### One-Command Start (Recommended)
1.  **Install Dependencies** (First time only):
    ```bash
    npm install
    # This will automatically install dependencies for root, frontend, and backend if script configured, 
    # otherwise run npm install in frontend and backend folders manually.
    ```
2.  **Start Development**:
    ```bash
    npm run dev
    ```
    - **Frontend**: http://localhost:5173
    - **Backend**: http://localhost:5000

### Manual Start
If you prefer running them separately:

**Backend**:
```bash
cd backend/server
npm run dev
```

**Frontend**:
```bash
cd frontend
npm run dev
```

---

## 7. Configuration Details

### Environment Variables (`backend/server/.env`)
The backend requires a `.env` file with:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```
> **Security Note**: This file is ignored by Git to protect sensitive credentials.

### Git Ignore
The root `.gitignore` ensures that build artifacts, logs, and `node_modules` are not pushed to the repository, keeping the codebase clean.
