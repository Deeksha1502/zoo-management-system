import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Animals from './pages/Animals';
import Habitats from './pages/Habitats';
import Staff from './pages/Staff';
import Visitors from './pages/Visitors';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/*" element={
              <>
                <Header />
                <div className="container">
                  <Routes>
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/animals" element={
                      <ProtectedRoute>
                        <Animals />
                      </ProtectedRoute>
                    } />
                    <Route path="/habitats" element={
                      <ProtectedRoute>
                        <Habitats />
                      </ProtectedRoute>
                    } />
                    <Route path="/staff" element={
                      <ProtectedRoute>
                        <Staff />
                      </ProtectedRoute>
                    } />
                    <Route path="/visitors" element={
                      <ProtectedRoute>
                        <Visitors />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </div>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;