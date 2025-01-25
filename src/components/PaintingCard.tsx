import React from 'react';
import { Link } from 'react-router-dom';
import { Painting } from '../types';

interface PaintingCardProps {
  painting: Painting;
}

export const PaintingCard = ({ painting }: PaintingCardProps) => {
  return (
    <Link to={`/painting/${painting.id}`} className="group">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
        <div className="relative h-80">
          <img
            src={painting.imageUrls[0]}
            alt={painting.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-cyan-700">
            {painting.title}
          </h3>
          <p className="text-gray-600 mt-2">{painting.artist}</p>
          <p className="text-cyan-600 font-semibold mt-2">
            ${painting.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
};