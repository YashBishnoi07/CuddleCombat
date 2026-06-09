import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import RoomSetup from './components/RoomSetup';
import RoomCoordinator from './components/RoomCoordinator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/setup" element={<RoomSetup />} />
        <Route path="/room/:roomId" element={<RoomCoordinator />} />
      </Routes>
    </Router>
  );
}

export default App;
