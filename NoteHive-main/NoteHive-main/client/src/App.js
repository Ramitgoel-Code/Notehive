import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Dashboard1 from "./components/Dashboard1";
import Home from "./components/Home";
import About from "./components/About";
import Notes from "./pages/Notes";
import Profile from "./components/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import ProfileCreation from "./components/ProfileCreation";
import NoteDetails from "./pages/NoteDetails";
import FAQ from "./components/FAQ";
import AdminPanel from "./components/AdminPanel";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import NoteManager from "./pages/NoteManager";
import CPTrivia from "./pages/CPTrivia";
import VerifyOTP from "./pages/VerifyOTP";
import SendOTP from "./pages/SendOTP";

const App = () => {
  const [username, setUsername] = useState(localStorage.getItem("username") || null);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");
  const [notes] = useState(JSON.parse(localStorage.getItem("notes")) || []);

  useEffect(() => {
    const handleStorageChange = () => {
      setUsername(localStorage.getItem("username") || null);
      setIsAdmin(localStorage.getItem("isAdmin") === "true");
    };
  
    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);
  
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <AppRoutes username={username} setUsername={setUsername} isAdmin={isAdmin} notes={notes} />
    </Router>
  );
};

const AppRoutes = ({ username, setUsername, isAdmin, notes }) => {
  const location = useLocation();

  return (
    <>
    
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Dashboard1 username={username} setUsername={setUsername} />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="notes" element={<Notes notes={notes} />} />
          <Route path="notes/:id" element={<NoteDetails />} />
         
          <Route path="login" element={<Login setUsername={setUsername} />} />
          <Route path="register" element={<Register setUsername={setUsername} />} />
          <Route path="cp-trivia" element={<CPTrivia/>}/>
          <Route path="/register-otp" element={<SendOTP />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

        </Route>

        {/* Protected Routes (Requires Login) */}
        <Route element={<ProtectedRoute username={username} />}>
          <Route path="profile" element={<Profile />} />
          {/* <Route path="create-profile" element={<ProfileCreation />} /> */}
        </Route>

        {/* Admin Panel (No note management) */}
        <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
        <Route path="/admin/noteManager" element={<NoteManager />} />
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Show FAQ only on the Home page */}
      {location.pathname === "/" && <FAQ />}
    </>
  );
};

export default App;
