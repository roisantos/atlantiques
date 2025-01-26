import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Plus, LogOut } from 'lucide-react';
import { PaintingForm } from '../components/PaintingForm';
import { Painting } from '../types';

export const Admin = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadPaintings();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
    }
  };

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
        stripePaymentLink: `https://buy.stripe.com/test_example${painting.id}`
      }));

      setPaintings(formattedPaintings);
    } catch (error) {
      console.error('Error loading paintings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handlePaintingAdded = () => {
    setShowForm(false);
    loadPaintings();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setShowForm(true)}
                className="mr-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Painting
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <PaintingForm onSuccess={handlePaintingAdded} onCancel={() => setShowForm(false)} />
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artist
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Images
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paintings.map((painting) => (
                  <tr key={painting.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {painting.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{painting.artist}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        ${painting.price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {painting.imageUrls.length} images
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(painting.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};