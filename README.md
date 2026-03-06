# TaskFlow Pro - Nonprofit Operating System

TaskFlow Pro is a comprehensive React-based command center designed for nonprofits, featuring 5 distinct persona dashboards to streamline operations, student management, mentoring, finance oversight, and super admin controls. Built with modern web technologies for scalability and user experience.

## Features

- **5 Persona Dashboards**:
  - Nonprofit Ops: Task management with drag-and-drop Kanban, email integration (Gmail), video conferencing (Zoom)
  - Student Portal: Personalized dashboard for students
  - Mentor Portal: Tools for mentors to track interactions
  - Finance Director: Donation tracking, student pipeline management with Kanban
  - Super Admin: System-wide oversight and configuration

- **Integrations**:
  - Gmail widget for email management
  - Zoom widget for meeting scheduling
  - Donation tracking with real-time updates
  - Firebase Auth for secure sign-in
  - Firestore for data persistence

- **Interactive Features**:
  - Drag-and-drop Kanban boards for task and pipeline management
  - Real-time data synchronization
  - Responsive design with Tailwind CSS
  - Animations with Framer Motion
  - Data visualization with Recharts

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore)
- **Libraries**: @hello-pangea/dnd (drag-and-drop), Lucide React (icons), Recharts (charts), Framer Motion (animations), React Router DOM (routing)
- **Tools**: ESLint, PostCSS, Firebase Admin SDK

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Firebase CLI (for emulators and deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/anthonywc080/Phaze-Marketing-Non-Profit-Impact.git
   cd Phaze-Marketing-Non-Profit-Impact
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Authentication (Google sign-in) and Firestore
   - Copy your Firebase config to `.env.local`:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. (Optional) Set up Firebase emulators for local development:
   ```bash
   firebase login
   firebase init emulators
   ```
   Select Firestore and Authentication emulators.

### Running Locally

1. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:5173.

2. (Optional) Start Firebase emulators:
   ```bash
   npm run emulators:start
   ```

3. Seed the database with sample data:
   ```bash
   npm run emulators:seed
   ```

4. Claim admin role (for testing):
   ```bash
   npm run emulators:admin
   ```

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deployment

This project is configured for deployment on Netlify:

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables: Set the VITE_FIREBASE_* variables in Netlify's environment settings.

For Firebase hosting:
```bash
firebase deploy
```

## Project Structure

```
src/
├── components/
│   ├── ui/          # Reusable UI components (Button, Modal, etc.)
│   └── widgets/     # Integration widgets (Gmail, Zoom, Donations)
├── context/         # React contexts (Role, Toast, Firebase)
├── firebase/        # Firebase config and helpers
├── views/           # Persona dashboards
│   ├── NonprofitOps.jsx
│   ├── StudentPortal.jsx
│   ├── MentorPortal.jsx
│   ├── FinanceDirector.jsx
│   └── SuperAdmin.jsx
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles with Tailwind
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting: `npm run lint`
5. Commit your changes
6. Push to your fork
7. Create a pull request

## License

This project is licensed under the MIT License.
