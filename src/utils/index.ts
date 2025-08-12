/**
 * Index file to consolidate and re-export all utilities
 * This creates a cleaner import pattern throughout the application
 */

// Export all Firebase utilities
export * from './firebaseUtils';

// Export authentication utilities
export { useAuth, signIn, signOut } from './auth';

// Export image storage utilities
export { 
  uploadImage, 
  uploadPropertyImage, 
  IMAGE_PROVIDER,
  generateTempPropertyId,
  updateImageUrlsWithPropertyId 
} from './imageStorage';
export type { ImageProvider, ImageUploadResult } from './imageStorage';

// Export mock data (used as fallback when Firebase is unavailable)
export { propertyData } from './data';
// Export types
export type { Property } from './data';
export type { ContactFormData } from './firebaseUtils';

// Export withAuth HOC
export { withAuth } from './withAuth';
