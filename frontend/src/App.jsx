import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ChurnAnalytics from './pages/ChurnAnalytics';
import AIInsights from './pages/AIInsights';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PublicCreateStartup from './pages/PublicCreateStartup';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/register-startup" element={<PublicCreateStartup />} />
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                <>
                  <Sidebar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/churn" element={<ChurnAnalytics />} />
                      <Route path="/analytics" element={<AIInsights />} />
                      {/* Other routes added dynamically */}
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </main>
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
