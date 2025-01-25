import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Gallery } from './pages/Gallery';
import { PaintingDetail } from './pages/PaintingDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/painting/:id" element={<PaintingDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;