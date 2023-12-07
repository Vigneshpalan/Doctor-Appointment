import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Spinner from "./components/Spinner";
import ApplyDoctor from "./pages/ApplyDoctor";
import Appointments from "./pages/Appointments";
import BookingPage from "./pages/BookingPage";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Review from "./pages/Review";
import NotificationPage from "./pages/NotificationPage";
import Register from "./pages/Register";
import Doctors from "./pages/admin/Doctors";
import Users from "./pages/admin/Users";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import Profile from "./pages/doctor/Profile";
import Docreview from "./pages/doctor/Docreview"
import UserProfile from "./pages/UserProfile";
import Health from "./pages/doctor/Health";

function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <><div>
    <header className="header">
         <h1>MEDPLUS</h1>
       </header>
       </div>
      <BrowserRouter>
        {loading ? (
          <Spinner />
        ) : (
          <Routes>
              <Route
              path="/review/:recordId/:doctorId"
              element={
                <ProtectedRoute>
                  <Review/>
                </ProtectedRoute>
              }
            />
              <Route
              path="/userprofile/:id"
              element={
                <ProtectedRoute>
                  <UserProfile/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/health"
              element={
                <ProtectedRoute>
                  <Health/>
                </ProtectedRoute>
              }
            />
             <Route
              path="/docr"
              element={
                <ProtectedRoute>
                  <Docreview/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apply-doctor"
              element={
                <ProtectedRoute>
                  <ApplyDoctor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute>
                  <Doctors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/profile/:id"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/book-appointment/:doctorId"
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              }
            />
           <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-appointments"
              element={
                <ProtectedRoute>
                  <DoctorAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notification"
              element={
                <ProtectedRoute>
                  <NotificationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
          </Routes>
        )}
      </BrowserRouter>
      <footer className="footer">
          <p>&copy; 2023 Doctor Appointment. All rights reserved.</p>
        </footer>
    </>
    
  );
}

export default App;
