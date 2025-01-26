import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface PaintingFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaintingForm = ({ onSuccess, onCancel }: PaintingFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    description: '',
    price: '',
    dimensions: '',
    medium: '',
    year: '',
    imageUrls: [''],
    pdfReport: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Insert painting
      const { data: painting, error: paintingError } = await supabase
        .from('paintings')
        .insert([{
          title: formData.title,
          artist: formData.artist,
          description: formData.description,
          price: parseFloat(formData.price),
          dimensions: formData.dimensions,
          medium: formData.medium,
          year: formData.year
        }])
        .select()
        .single();

      if (paintingError) throw paintingError;

      // Insert images
      if (formData.imageUrls[0]) {
        const { error: imagesError } = await supabase
          .from('painting_images')
          .insert(
            formData.imageUrls
              .filter(url => url.trim())
              .map((url, index) => ({
                painting_id: painting.id,
                url,
                order: index
              }))
          );

        if (imagesError) throw imagesError;
      }

      // Insert PDF report
      if (formData.pdfReport) {
        const { error: reportError } = await supabase
          .from('painting_reports')
          .insert([{
            painting_id: painting.id,
            url: formData.pdfReport
          }]);

        if (reportError) throw reportError;
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    if (index === newImageUrls.length - 1 && value) {
      newImageUrls.push('');
    }
    setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Add New Painting</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Artist</label>
          <input
            type="text"
            name="artist"
            required
            value={formData.artist}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price (£)</label>
          <input
            type="number"
            name="price"
            required
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dimensions</label>
          <input
            type="text"
            name="dimensions"
            required
            value={formData.dimensions}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Medium</label>
          <input
            type="text"
            name="medium"
            required
            value={formData.medium}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="text"
            name="year"
            required
            value={formData.year}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Image URLs</label>
          {formData.imageUrls.map((url, index) => (
            <input
              key={index}
              type="url"
              value={url}
              onChange={(e) => handleImageUrlChange(index, e.target.value)}
              placeholder="Enter image URL"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
            />
          ))}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">PDF Report URL</label>
          <input
            type="url"
            name="pdfReport"
            value={formData.pdfReport}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-cyan-400"
        >
          {loading ? 'Saving...' : 'Save Painting'}
        </button>
      </div>
    </form>
  );
};