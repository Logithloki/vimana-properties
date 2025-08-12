// Cloudinary image storage utility
// Sign up at https://cloudinary.com for free account

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string; // Create an unsigned upload preset in Cloudinary dashboard
}

export const uploadToCloudinary = async (
  file: File, 
  config: CloudinaryConfig,
  propertyId?: string,
  imageType?: 'main' | 'gallery'
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);
      // Organize images by property ID and type
    const folder = propertyId 
      ? `real-estate-properties/${propertyId}` 
      : 'real-estate-properties/temp';
    formData.append('folder', folder);
    
    // Add tags for better organization and filtering
    const tags = ['real-estate', 'property'];
    if (propertyId) tags.push(`property-${propertyId}`);
    if (imageType) tags.push(imageType);
    formData.append('tags', tags.join(','));
    
    // Use descriptive public_id for easy identification
    if (propertyId && imageType) {
      const timestamp = Date.now();
      const publicId = `${propertyId}_${imageType}_${timestamp}`;
      formData.append('public_id', publicId);
      console.log(`Uploading image with public_id: ${publicId} to folder: ${folder}`);
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload to Cloudinary');
    }    const data = await response.json();
    console.log('Cloudinary upload successful:', {
      url: data.secure_url,
      public_id: data.public_id,
      folder: data.folder,
      tags: data.tags
    });
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Cloudinary transformation URLs for different sizes
export const getCloudinaryImageUrl = (
  publicId: string, 
  cloudName: string,
  transformations?: string
): string => {
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  const transforms = transformations || 'w_800,h_600,c_fill,q_auto';
  return `${baseUrl}/${transforms}/${publicId}`;
};

// Example transformations:
// w_400,h_300,c_fill - 400x300 cropped
// w_800,h_600,c_fit - 800x600 fitted
// q_auto - automatic quality
// f_auto - automatic format (WebP, etc.)

export const cloudinaryConfig: CloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset',
};
