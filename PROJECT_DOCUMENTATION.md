# Sponsorship Platform - Project Documentation

## 1. Project Overview
**Name**: Team-8 Sponsorship Platform
**Description**: A crowdfunding and sponsorship platform connecting students/alumni with clubs and companies.
**Tech Stack**:
- **Frontend**: React (Vite), Tailwind CSS v4 (via PostCSS), Lucide React Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs

---

---

## 2. Directory Structure
The project is organized into two main workspaces:
- **`frontend/`**: Contains the React + Vite application.
    - **`components/`**: Reusable UI parts (`AdminPanel`, `DashboardLayout`) and specific Pages (`AdminDashboard`, `Register`, etc.).
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
- **Registration Fields**:
    - **Club Admin**: Requires `clubName` + Verification Document.
    - **Company**: Requires `organizationName` + Verification Document.
    - **Alumni**: Requires `formerInstitution`.
- **Flow**:
    - **Landing Page**: New entry point at `/` with options to Login or Register.
    - **Login Redirection**:
        - `administrator` -> `/admin/dashboard`
        - `company` -> `/company/dashboard`
        - `club-admin` -> `/club/dashboard`
        - `alumni-individual` -> `/alumni/dashboard`
    - **Protection**: `ProtectedRoute` checks for token AND `allowedRoles` to prevent unauthorized access.

### B. Dashboard & Layouts
**Status**: ✅ Complete
- **Structure**:
    - **`DashboardLayout`**: A shared wrapper component providing the Sidebar, Top Navigation, and Mobile responsiveness for all authenticated views.
    - **Role-Specific Views**:
        - **`AdminDashboard`**: Quick stats + Embedded `AdminPanel` for user verification.
        - **`CompanyDashboard`**: (Placeholder) Sponsorship management.
        - **`ClubDashboard`**: (Placeholder) Proposal creation.
        - **`AlumniDashboard`**: (Placeholder) Donation tracking.
- **Admin Features**:
    - **Document Viewer**: Modal to view/zoom verification documents (Images & PDFs).
    - **Verification**: Approve/Reject users directly from the dashboard.

### C. Profile Management
**Status**: ✅ Complete
- **Feature**: Users can edit their details (Phone, Logo, Bio, Organization Name).
- **Password Change**: Users can securely change their passwords.

### D. Admin Panel (Component)
**Status**: ✅ Complete
- **Access**: Strictly restricted to users with `role: 'administrator'`.
- **Integration**: Designed as a reusable `<AdminPanel />` component that takes an `isEmbedded` prop to adapt its layout (hiding headers when inside a dashboard).
- **Features**: 
    1.  **View Pending/All Users**: List and filter users.
    2.  **Document Viewer**: Integrated modal for proof verification.
    3.  **Approve/Reject**: Update user verification status.
    4.  **Password Reset**: Admin can forced-reset any user's password.

---

## 4. API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| POST | `/register` | Register new user (with file upload) | No |
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
    - **Layouts**:
        - `DashboardLayout.jsx`: Shared shell for authenticated pages.
    - **Pages**:
        - `LandingPage.jsx`: Main entry point.
        - `AdminDashboard.jsx`, `CompanyDashboard.jsx`, etc.: Role-specific main views.
        - `Login.jsx` / `Register.jsx`: Auth forms.
        - `Profile.jsx`: User settings.
    - **Widgets**:
        - `AdminPanel.jsx`: Management table & document viewer.
- **`services/`**:
    - `api.js`: Centralized fetch wrappers.
- **`App.jsx`**: Routing definition with `ProtectedRoute`.

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
- **`frontend/src/pages/`**: For full page views.
- **`frontend/src/components/`**: Strictly for reusable widgets.

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
