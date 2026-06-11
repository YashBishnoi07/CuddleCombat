import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Landing from './components/Landing';
import RoomSetup from './components/RoomSetup';
import RoomCoordinator from './components/RoomCoordinator';
import Auth from './components/Auth';
import TopNav from './components/TopNav';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <TopNav />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/setup" element={<ProtectedRoute><RoomSetup /></ProtectedRoute>} />
          <Route path="/room/:roomId" element={<ProtectedRoute><RoomCoordinator /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
