// Debug utility to verify image associations
'use client';

import { useState } from 'react';
import { getPropertiesFromFirebase } from '@/utils/firebaseUtils';
import type { Property } from '@/utils';

export default function ImageDebugPanel() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProperties = await getPropertiesFromFirebase();
      setProperties(fetchedProperties);
    } catch (err) {
      setError('Failed to load properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateImageUrl = (url: string): boolean => {
    return url && (
      url.startsWith('http') || 
      url.startsWith('/images/') ||
      url.includes('cloudinary.com') ||
      url.includes('imgur.com')
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">Image Association Debug Panel</h2>
      
      <button
        onClick={loadProperties}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
      >
        {loading ? 'Loading...' : 'Check Image Associations'}
      </button>

      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {properties.length > 0 && (
        <div className="space-y-4">
          {properties.map((property) => (
            <div key={property.id} className="border rounded p-4">
              <h3 className="font-bold text-lg">{property.title}</h3>
              <p className="text-sm text-gray-600 mb-2">ID: {property.id}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Main Image */}
                <div>
                  <h4 className="font-semibold mb-2">Main Image:</h4>
                  {property.mainImage ? (
                    <div>
                      <p className="text-xs text-gray-500 mb-1 break-all">
                        {property.mainImage}
                      </p>
                      <div className="w-32 h-24 border rounded overflow-hidden">
                        <img
                          src={property.mainImage}
                          alt="Main"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder-property.jpg';
                          }}
                        />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        validateImageUrl(property.mainImage) 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {validateImageUrl(property.mainImage) ? 'Valid URL' : 'Invalid URL'}
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-500">No main image</p>
                  )}
                </div>

                {/* Gallery Images */}
                <div>
                  <h4 className="font-semibold mb-2">Gallery Images ({property.images?.length || 0}):</h4>
                  {property.images && property.images.length > 0 ? (
                    <div className="space-y-2">
                      {property.images.slice(0, 3).map((image, index) => (
                        <div key={index}>
                          <p className="text-xs text-gray-500 break-all">{image}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-12 border rounded overflow-hidden">
                              <img
                                src={image}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/placeholder-property.jpg';
                                }}
                              />
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${
                              validateImageUrl(image) 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {validateImageUrl(image) ? 'Valid' : 'Invalid'}
                            </span>
                          </div>
                        </div>
                      ))}
                      {property.images.length > 3 && (
                        <p className="text-xs text-gray-500">+{property.images.length - 3} more images</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No gallery images</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
