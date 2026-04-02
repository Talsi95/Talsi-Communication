import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SalesWizard from './pages/SalesWizard';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-indigo-950">
      <Router>
        {/* <div className="min-h-screen bg-gray-50 font-sans"> */}
        <Navbar />
        <Routes>
          {/* דף הבית - פתוח לכולם (מציג חבילות רגילות או VIP לסוכן) */}
          <Route path="/" element={<Home />} />

          {/* דף התחברות סוכנים */}
          <Route path="/login" element={<Login />} />

          <Route path="/wizard" element={<SalesWizard />} />

          {/* דף 404 - אופציונלי: הפניה חזרה הביתה אם הנתיב לא קיים */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {/* </div> */}
      </Router>
    </div>
  );
}

export default App;
