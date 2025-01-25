import React from 'react';
import { Link } from 'react-router-dom';
import { Waves } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-cyan-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
            <Waves size={32} />
            <span>Atlantis Gallery</span>
          </Link>
          <div className="text-lg">
            <Link to="/" className="hover:text-cyan-300 transition-colors">
              Gallery
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};