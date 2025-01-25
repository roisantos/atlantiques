import React from 'react';
import { Waves } from 'lucide-react';
import { PaintingCard } from '../components/PaintingCard';
import { paintings } from '../data/paintings';

export const Gallery = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative h-[80vh] bg-cyan-900 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source
            src="https://player.vimeo.com/external/517629306.hd.mp4?s=f4fb435c0cba2824549c7c13b5b44fa3f0f5f8e3&profile_id=175"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-white text-center">
          <div className="flex items-center mb-8">
            <Waves size={64} className="text-cyan-300" />
            <h1 className="text-6xl font-bold ml-4">Atlantis Gallery</h1>
          </div>
          <p className="text-2xl max-w-2xl mx-auto text-cyan-100">
            Discover the mystical beauty of the lost city through our exclusive collection of Atlantean art
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Each piece tells a story of the legendary underwater civilization
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paintings.map((painting) => (
            <PaintingCard key={painting.id} painting={painting} />
          ))}
        </div>
      </div>
    </div>
  );
};