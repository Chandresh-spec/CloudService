# CloudVault - Frontend Application

A production-grade, responsive Cloud Storage web application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Vite**, connecting to the FastAPI backend.

---

## 🚀 Key Features

### 1. Ultra-Secure Authentication & 2FA Flow
- **Registration**: Form with live client-side validation (Name: 5-50 chars, Email format, Password: 8-50 chars with dynamic strength evaluation meter and matching confirm-password).
- **OTP Verification**: 6-digit input boxes with auto-focus, paste auto-fill, backspace navigation, and auto-submit on completion.
- **Developer Helper**: Automatically detects server-issued OTP in development and provides a 1-click Auto-Fill shortcut.
- **Resend Cooldown**: 150-second live countdown timer matching backend configuration.
- **Celebration Effects**: Confetti bursts (`canvas-confetti`) on successful account verification.
- **FastAPI Error Handling**: Formatted alerts for rate limits (HTTP 429), expired codes, invalid OTPs, and conflict errors (HTTP 409).

### 2. Full Cloud Storage Drive & Dashboard
- **Sidebar Navigation**: Filter by *All Files*, *Starred*, *Recent*, *Shared Links*, and *Trash*.
- **Category Filter**: Instant category filtering (*Documents*, *Images*, *Archives*, *Code*, *Others*).
- **Live Storage Meter**: Multi-category breakdown bar displaying allocated vs. used capacity (100 GB tier).
- **Folder Navigation**: Interactive folder cards with file counts and accent colors.
- **Dual View Modes**: Switch between responsive **Grid View** and detailed **List / Table View**.
- **Interactive File Cards**:
  - File extension badges (.pdf, .png, .zip, .py, etc.)
  - Star / favorite toggling
  - File details & SHA-256 integrity inspection modal
  - Time-limited encrypted share link generator with password protection modal
  - Download trigger
- **Drag & Drop Upload Dropzone**:
  - Drag files anywhere into the upload drawer with live upload progress simulation.
  - Adds uploaded items directly to the cloud files state.

---

## 🛠️ Development Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev
```

The frontend runs locally at `http://localhost:5173`.
CORS is pre-configured on the FastAPI backend (`http://localhost:8000`) to permit requests from `http://localhost:5173` and `http://localhost:3000`.

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthPage.tsx          # Split hero layout with brand features
│   │   │   ├── LoginForm.tsx         # Sign in & quick demo account login
│   │   │   ├── OtpVerification.tsx   # 6-digit OTP input with auto-advance & timer
│   │   │   └── RegisterForm.tsx      # Registration form with password strength
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx         # Main cloud drive container & state
│   │   │   ├── FileList.tsx          # Grid & List table views with sorting
│   │   │   ├── FilePreviewModal.tsx  # File metadata & SHA-256 checksum inspector
│   │   │   ├── FolderGrid.tsx        # Visual folder cards with file counts
│   │   │   ├── ShareModal.tsx        # Time-limited link & passphrase generator
│   │   │   ├── Sidebar.tsx           # Navigation tabs, categories, & storage meter
│   │   │   ├── StorageOverview.tsx   # Metrics cards & status banner
│   │   │   └── UploadDropzone.tsx    # Drag-and-drop file upload with progress bar
│   │   ├── ui/
│   │   │   └── Toast.tsx             # Floating notification toasts
│   │   └── Navbar.tsx                # Top navigation with live FastAPI health status
│   ├── context/
│   │   └── AuthContext.tsx           # Authentication state & persistent session
│   ├── services/
│   │   └── api.ts                    # API client with FastAPI error formatting
│   ├── types/
│   │   └── index.ts                  # TypeScript models and interfaces
│   ├── App.tsx                       # Root view coordinator
│   ├── index.css                     # Tailwind CSS & glassmorphism theme styling
│   └── main.tsx                      # Application entry point
├── package.json
└── vite.config.ts
```
