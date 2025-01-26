import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ContactForm } from '../components/ContactForm';
import { supabase } from '../lib/supabase';
import { Painting } from '../types';

export const PaintingDetail = () => {
  const { id } = useParams();
  const [painting, setPainting] = useState<Painting | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadPainting();
  }, [id]);

  const loadPainting = async () => {
    if (!id) return;

    try {
      const { data: paintingData, error: paintingError } = await supabase
        .from('paintings')
        .select(`
          *,
          painting_images (url, order),
          painting_reports (url)
        `)
        .eq('id', id)
        .single();

      if (paintingError) throw paintingError;

      const formattedPainting = {
        id: paintingData.id,
        title: paintingData.title,
        artist: paintingData.artist,
        description: paintingData.description,
        price: paintingData.price,
        dimensions: paintingData.dimensions,
        medium: paintingData.medium,
        year: paintingData.year,
        imageUrls: paintingData.painting_images
          .sort((a: any, b: any) => a.order - b.order)
          .map((img: any) => img.url),
        pdfReport: paintingData.painting_reports[0]?.url || '',
        stripePaymentLink: `https://buy.stripe.com/8wM6qz9fVeTX5zi3cT` // Update with real Stripe links
      };

      setPainting(formattedPainting);
    } catch (error) {
      console.error('Error loading painting:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!painting) {
    return <Navigate to="/" replace />;
  }

  const handleImageClick = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % painting.imageUrls.length
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div 
                onClick={handleImageClick}
                className="cursor-pointer relative group"
              >
                <img
                  src={painting.imageUrls[currentImageIndex]}
                  alt={`${painting.title} - View ${currentImageIndex + 1}`}
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                  <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to view next image ({currentImageIndex + 1}/{painting.imageUrls.length})
                  </p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {painting.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">by {painting.artist}</p>
              
              <div className="space-y-4 mb-8">
                <p className="text-gray-700">{painting.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Dimensions</p>
                    <p className="font-medium">{painting.dimensions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Medium</p>
                    <p className="font-medium">{painting.medium}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-medium">{painting.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">${painting.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <a
                  href={painting.stripePaymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-cyan-600 text-white text-center py-3 px-4 rounded-md hover:bg-cyan-700 transition-colors"
                >
                  Purchase Now
                </a>

                {painting.pdfReport && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Artwork Report
                    </h3>
                    <div className="aspect-[4/3] w-full">
                      <iframe
                        src={painting.pdfReport}
                        title={`${painting.title} Report`}
                        className="w-full h-full border-0 rounded"
                      />
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Request Information
                  </h3>
                  <ContactForm painting={painting} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};