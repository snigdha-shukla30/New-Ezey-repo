import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Splash from "./pages/Splash/splash";
import Dashboard from "./pages/Dashboard/Dashboard";
import ImportSummary from "./pages/ImportSummary/ImportSummary";
import EzeyForm from "./pages/DataFilling/EzeyForm";
import DataEntry from "./pages/DataEntry/DataEntry";
import EzeySignupPage from "./pages/Auth/Signup";
import EzeyLoginPage from "./pages/Auth/Login";
import EzeyForgotPasswordPage from "./pages/Auth/ForgetPassword";
import EmailVerificationPage from "./pages/Auth/EmailVerification";
import EmailVerifiedPage from "./pages/Auth/EmailVerified";
import GenerateTimetablePage from "./pages/GenerateTT/generate";
import BalancedTimeTablePage from "./pages/TimeTable/BalancedTT";
import ManualEntryClassroom from "./pages/ManualEntryPages/ManualEntryClassroom";
import ManualEntryFaculty from "./pages/ManualEntryPages/ManualEntryFaculty";
import ManualEntrySubject from "./pages/ManualEntryPages/ManualEntrySubject";
import ManualEntryBatch from "./pages/ManualEntryPages/ManaualEntryBatch";


// import FacultyOptimizedTimeTablePage from "./pages/TimeTable/FacultyOptimizedTT";
// import RoomOptimizedTimeTablePage from "./pages/TimeTable/RoomOptimizedTT";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<EzeyLoginPage />} />
        <Route path="/signup" element={<EzeySignupPage />} />
        <Route path="/forgetpassword" element={<EzeyForgotPasswordPage />} />
        <Route path="/verification" element={<EmailVerificationPage />} />
        <Route path="/form" element={< EzeyForm />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/dashboard" element={< Dashboard />} />
        <Route path="/import" element={< ImportSummary />} />
        {/* <Route path="/dashboard" element={< Dashboard />} />  */}
        <Route path="/dataentry" element={< DataEntry />} />
        <Route path="/manual/classroom" element={< ManualEntryClassroom />} />
        <Route path="/manual/faculty" element={< ManualEntryFaculty />} />
        <Route path="/manual/subjects" element={< ManualEntrySubject />} />
        <Route path="/manual/batches" element={< ManualEntryBatch />} />
        <Route path="/generate" element={< GenerateTimetablePage />} />
        <Route
          path="/timetable/preview/:batchId"
          element={<BalancedTimeTablePage />}
        />
        {/* <Route path="/timetable/preview/:timetableId" element={< BalancedTimeTablePage />} /> */}

        {/* <Route path="/verified" element={< EmailVerifiedPage />} />  */}

        <Route path="/verified" element={<EmailVerifiedPage />} />

        {/* Protected Routes - Require Authentication */}
        {/* <Route 
          path="/form" 
          element={
            <ProtectedRoute>
              <EzeyForm />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/splash" 
          element={
            <ProtectedRoute>
              <Splash />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/import" 
          element={
            <ProtectedRoute>
              <ImportSummary />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/dataentry" 
          element={
            <ProtectedRoute>
              <DataEntry />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/generate" 
          element={
            <ProtectedRoute>
              <GenerateTimetablePage />
            </ProtectedRoute>
          } 
        />

        <Route
          path="/timetable/preview/:batchId"
          element={
            <ProtectedRoute>
              <BalancedTimeTablePage />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </Router>
  );
}

export default App
