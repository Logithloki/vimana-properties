// Test component to verify Cloudinary upload
// Use this to test your Cloudinary configuration

import { useState } from 'react';
import Image from 'next/image';
import { uploadToCloudinary, cloudinaryConfig } from '@/utils/cloudinaryStorage';

export default function CloudinaryTest() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Cloudinary config:', cloudinaryConfig);
      const imageUrl = await uploadToCloudinary(file, cloudinaryConfig);
      setResult(imageUrl);
      console.log('Upload successful:', imageUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-lg font-bold mb-4">Cloudinary Upload Test</h3>
      
      <div className="mb-4">
        <p><strong>Cloud Name:</strong> {cloudinaryConfig.cloudName || 'Not set'}</p>
        <p><strong>Upload Preset:</strong> {cloudinaryConfig.uploadPreset || 'Not set'}</p>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={uploading}
        className="mb-4"
      />

      {uploading && <p className="text-blue-600">Uploading...</p>}
      
      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div className="text-green-600 bg-green-50 p-3 rounded">
          <p><strong>Success!</strong> Image uploaded to:</p>
          <a href={result} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
            {result}
          </a>          <div className="mt-2">
            <Image src={result} alt="Uploaded" width={300} height={200} className="max-w-xs h-auto rounded" />
          </div>
        </div>
      )}
    </div>
  );
}
