// Local image storage utility
// This approach stores images in the public/images folder

export const uploadToLocalStorage = async (file: File): Promise<string> => {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `property-${timestamp}-${randomString}.${fileExtension}`;
    
    // For local development, we'll simulate upload and return a placeholder
    // In a real app, you'd need a server endpoint to handle file uploads
    console.log('Would upload file:', fileName);
    
    // Return a path that points to the public/images folder
    return `/images/${fileName}`;
  } catch (error) {
    console.error('Error in local image upload:', error);
    return '/images/placeholder-property.jpg';
  }
};

// For demo purposes, let's create some mock image URLs
export const getMockImageUrl = (index: number = 1): string => {
  const mockImages = [
    '/images/placeholder-property.jpg',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
    'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  ];
  
  return mockImages[index % mockImages.length] || mockImages[0];
};

// Alternative: Use Unsplash for demo images
export const getUnsplashImage = (width: number = 800, height: number = 600, seed?: string): string => {
  const seedParam = seed ? `&seed=${seed}` : '';
  return `https://source.unsplash.com/${width}x${height}/?house,real-estate,property${seedParam}`;
};
