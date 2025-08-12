// Unified image storage utility - switch between different providers
import { uploadToCloudinary, cloudinaryConfig } from './cloudinaryStorage';
import { uploadToImgur, imgurConfig } from './imgurStorage';
import { getMockImageUrl, getUnsplashImage } from './localImageStorage';

export type ImageProvider = 'local' | 'cloudinary' | 'imgur' | 'unsplash' | 'firebase';

export interface ImageUploadResult {
  url: string;
  provider: ImageProvider;
  success: boolean;
  error?: string;
}

export const uploadImage = async (
  file: File, 
  provider: ImageProvider = 'local',
  propertyId?: string,
  imageType?: 'main' | 'gallery'
): Promise<ImageUploadResult> => {
  try {
    let url: string;

    switch (provider) {
      case 'cloudinary':
        if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
          throw new Error('Cloudinary configuration missing');
        }
        url = await uploadToCloudinary(file, cloudinaryConfig, propertyId, imageType);
        break;

      case 'imgur':
        if (!imgurConfig.clientId) {
          throw new Error('Imgur configuration missing');
        }
        url = await uploadToImgur(file, imgurConfig.clientId);
        break;

      case 'unsplash':
        // For demo: use Unsplash random images
        const seed = propertyId ? `${propertyId}-${imageType}` : file.name;
        url = getUnsplashImage(800, 600, seed);
        break;

      case 'local':
      default:
        // For demo: use placeholder or mock images
        url = getMockImageUrl(Math.floor(Math.random() * 6));
        break;
    }

    return {
      url,
      provider,
      success: true,
    };
  } catch (error) {
    console.error(`Error uploading image with ${provider}:`, error);
    
    // Fallback to placeholder image
    return {
      url: '/images/placeholder-property.jpg',
      provider: 'local',
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
};

// Configuration - set your preferred provider
export const IMAGE_PROVIDER: ImageProvider = 
  (process.env.NEXT_PUBLIC_IMAGE_PROVIDER as ImageProvider) || 'local';

// Helper function for the admin forms
export const uploadPropertyImage = async (
  file: File, 
  propertyId?: string, 
  imageType?: 'main' | 'gallery'
): Promise<string> => {
  const result = await uploadImage(file, IMAGE_PROVIDER, propertyId, imageType);
  return result.url;
};

// Utility to generate temporary property ID for image uploads
export const generateTempPropertyId = (): string => {
  return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

// Utility to update image URLs with actual property ID after creation
export const updateImageUrlsWithPropertyId = (
  imageUrls: string[], 
  tempId: string, 
  actualId: string
): string[] => {
  return imageUrls.map(url => {
    // For Cloudinary URLs, update the folder path
    if (url.includes('cloudinary.com') && url.includes(tempId)) {
      return url.replace(`/temp/${tempId}/`, `/${actualId}/`);
    }
    return url;
  });
};
