import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SalesWizard from './pages/SalesWizard';

// רכיב עזר להגנה על נתיבים (רק סוכנים מחוברים יכולים להיכנס)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // אם אין טוקן, נשלח אותו להתחבר
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Routes>
          {/* דף הבית - פתוח לכולם (מציג חבילות רגילות או VIP לסוכן) */}
          <Route path="/" element={<Home />} />

          {/* דף התחברות סוכנים */}
          <Route path="/login" element={<Login />} />

          <Route path="/wizard" element={<SalesWizard />} />

          {/* דף 404 - אופציונלי: הפניה חזרה הביתה אם הנתיב לא קיים */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
