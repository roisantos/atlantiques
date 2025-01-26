import React, { useEffect, useState } from 'react';
import { Waves } from 'lucide-react';
import { PaintingCard } from '../components/PaintingCard';
import { supabase } from '../lib/supabase';
import { Painting } from '../types';

export const Gallery = () => {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaintings();
  }, []);

  const loadPaintings = async () => {
    try {
      const { data: paintingsData, error: paintingsError } = await supabase
        .from('paintings')
        .select(`
          *,
          painting_images (url, order),
          painting_reports (url)
        `)
        .order('created_at', { ascending: false });

      if (paintingsError) throw paintingsError;

      const formattedPaintings = paintingsData.map(painting => ({
        id: painting.id,
        title: painting.title,
        artist: painting.artist,
        description: painting.description,
        price: painting.price,
        dimensions: painting.dimensions,
        medium: painting.medium,
        year: painting.year,
        imageUrls: painting.painting_images
          .sort((a: any, b: any) => a.order - b.order)
          .map((img: any) => img.url),
        pdfReport: painting.painting_reports[0]?.url || '',
        stripePaymentLink: `https://buy.stripe.com/test_example${painting.id}` // You'll need to update this with real Stripe links
      }));

      setPaintings(formattedPaintings);
    } catch (error) {
      console.error('Error loading paintings:', error);
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-6xl font-bold ml-4">Atlantiques</h1>
          </div>
          <p className="text-2xl max-w-2xl mx-auto text-cyan-100">
          Welcome to Atlantiques.co.uk  by gallerist Carlos Moreno, based in London.    </p>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Each piece is carefully selected and restored.
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paintings.map((painting) => (
              <PaintingCard key={painting.id} painting={painting} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};