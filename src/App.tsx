import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Gallery } from './pages/Gallery';
import { PaintingDetail } from './pages/PaintingDetail';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/"
            element={
              <>
                <Header />
                <Gallery />
              </>
            }
          />
          <Route
            path="/painting/:id"
            element={
              <>
                <Header />
                <PaintingDetail />
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;