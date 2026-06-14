import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Landing from './components/Landing';
import RoomSetup from './components/RoomSetup';
import RoomCoordinator from './components/RoomCoordinator';
import Auth from './components/Auth';
import BottomNav from './components/BottomNav';
import MatchesTab from './components/MatchesTab';
import ChatTab from './components/ChatTab';
import ProfileTab from './components/ProfileTab';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/setup" element={<ProtectedRoute><RoomSetup /></ProtectedRoute>} />
            <Route path="/room/:roomId" element={<ProtectedRoute><RoomCoordinator /></ProtectedRoute>} />
            <Route path="/matches" element={<ProtectedRoute><MatchesTab /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatTab /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileTab /></ProtectedRoute>} />
          </Routes>
          <BottomNav />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
