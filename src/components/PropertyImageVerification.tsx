// Component to verify property-image relationship
'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/utils';

interface PropertyImageMapping {
  propertyId: string;
  propertyTitle: string;
  mainImage: string;
  galleryImages: string[];
  cloudinaryInfo: {
    hasPropertyId: boolean;
    propertyIdInUrl: string | null;
    imageCount: number;
  };
}

export default function PropertyImageVerification() {
  const [mappings, setMappings] = useState<PropertyImageMapping[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPropertyImageMappings = async () => {
      try {
        const { getPropertiesFromFirebase } = await import('@/utils');
        const properties = await getPropertiesFromFirebase();
        
        const mappings: PropertyImageMapping[] = properties.map((property: Property) => {
          // Extract Cloudinary info from image URLs
          const extractCloudinaryInfo = (urls: string[]) => {
            const cloudinaryUrls = urls.filter(url => url.includes('cloudinary.com'));
            const propertyIdMatches = cloudinaryUrls
              .map(url => {
                const match = url.match(/real-estate-properties\/([^\/]+)/);
                return match ? match[1] : null;
              })
              .filter(Boolean);
            
            return {
              hasPropertyId: propertyIdMatches.length > 0,
              propertyIdInUrl: propertyIdMatches[0] || null,
              imageCount: cloudinaryUrls.length
            };
          };

          const allImages = [
            property.mainImage || '',
            ...(property.images || [])
          ].filter(Boolean);

          return {
            propertyId: property.id,
            propertyTitle: property.title,
            mainImage: property.mainImage || '',
            galleryImages: property.images || [],
            cloudinaryInfo: extractCloudinaryInfo(allImages)
          };
        });
        
        setMappings(mappings);
      } catch (error) {
        console.error('Error verifying property-image mappings:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyPropertyImageMappings();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Property-Image Verification</h3>
        <p>Loading verification data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold mb-4">Property-Image ID Verification</h3>
      <p className="text-sm text-gray-600 mb-4">
        Verifying that Firebase property IDs match Cloudinary folder organization
      </p>
      
      <div className="space-y-4">
        {mappings.map((mapping) => (
          <div key={mapping.propertyId} className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium">{mapping.propertyTitle}</h4>
                <p className="text-sm text-gray-600">
                  Firebase ID: <code className="bg-gray-100 px-1 rounded">{mapping.propertyId}</code>
                </p>
              </div>
              <div className="text-right">
                {mapping.cloudinaryInfo.hasPropertyId ? (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                    ✓ ID Match
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                    ✗ ID Mismatch
                  </span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium mb-1">Cloudinary Info:</p>
                <ul className="text-gray-600 space-y-1">
                  <li>
                    Property ID in URL: 
                    <code className="bg-gray-100 px-1 rounded ml-1">
                      {mapping.cloudinaryInfo.propertyIdInUrl || 'None'}
                    </code>
                  </li>
                  <li>Total Images: {mapping.cloudinaryInfo.imageCount}</li>
                  <li>
                    Match Status: 
                    <span className={`ml-1 ${
                      mapping.cloudinaryInfo.propertyIdInUrl === mapping.propertyId 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {mapping.cloudinaryInfo.propertyIdInUrl === mapping.propertyId 
                        ? 'Perfect Match' 
                        : 'Mismatch'}
                    </span>
                  </li>
                </ul>
              </div>
              
              <div>
                <p className="font-medium mb-1">Image URLs:</p>
                <div className="text-gray-600 space-y-1 max-h-20 overflow-y-auto">
                  {mapping.mainImage && (
                    <div className="text-xs">
                      <span className="font-medium">Main:</span> {mapping.mainImage.substring(0, 50)}...
                    </div>
                  )}
                  {mapping.galleryImages.map((url, index) => (
                    <div key={index} className="text-xs">
                      <span className="font-medium">Gallery {index + 1}:</span> {url.substring(0, 50)}...
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>How to interpret:</strong> Green "✓ ID Match" means the Firebase property ID 
          matches the Cloudinary folder structure. This ensures images are properly organized 
          and can be retrieved correctly.
        </p>
      </div>
    </div>
  );
}
