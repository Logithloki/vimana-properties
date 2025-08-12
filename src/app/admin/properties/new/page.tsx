'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Button from '@/components/Button';
import { withAuth } from '@/utils';

interface PropertyFormData {
  title: string;
  price: number;
  location: string;
  address: string;
  type: string;
  serviceType: 'property' | 'land';
  status: 'For Sale' | 'Sold';
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  features: string[];
  featured: boolean;
}

function NewPropertyPage() {
  const router = useRouter();
  const featuresInputRef = useRef<HTMLInputElement | null>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [propertyImages, setPropertyImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<PropertyFormData>();

  const addFeature = () => {
    if (featuresInputRef.current && featuresInputRef.current.value.trim() !== '') {
      setFeatures([...features, featuresInputRef.current.value.trim()]);
      featuresInputRef.current.value = '';
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setPropertyImages(filesArray);
    }
  };
  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);
    setError('');    try {
      // Using consolidated utils index for all Firebase operations
      const { uploadPropertyImage } = await import('@/utils/imageStorage');
      const { createProperty } = await import('@/utils');
      
      // Step 1: Create property document first to get the real Firebase ID
      const propertyDataWithoutImages = {
        ...data,
        price: Number(data.price),
        bedrooms: Number(data.bedrooms),
        bathrooms: Number(data.bathrooms),
        area: Number(data.area),
        features,
        mainImage: '', // Will be updated after upload
        images: [], // Will be updated after upload
        createdAt: new Date()
      };
      
      // Create property and get the real Firebase-generated ID
      const propertyId = await createProperty(propertyDataWithoutImages);
      console.log('Property created with Firebase ID:', propertyId);
      
      // Step 2: Upload images using the real property ID
      let mainImageUrl = '';
      if (mainImage) {
        console.log('Uploading main image for property:', propertyId);
        mainImageUrl = await uploadPropertyImage(mainImage, propertyId, 'main');
      }
      
      // Upload property images with the real property ID
      const imageUrls = [];
      for (let i = 0; i < propertyImages.length; i++) {
        console.log(`Uploading gallery image ${i + 1}/${propertyImages.length} for property:`, propertyId);
        const url = await uploadPropertyImage(propertyImages[i], propertyId, 'gallery');
        imageUrls.push(url);
      }
      
      // Step 3: Update property with the uploaded image URLs
      if (mainImageUrl || imageUrls.length > 0) {
        const { updateProperty } = await import('@/utils');
        await updateProperty(propertyId, {
          mainImage: mainImageUrl,
          images: imageUrls,
          updatedAt: new Date()
        });
        console.log('Property updated with image URLs');
      }      
      // Log for debugging - ensure property is created with images
      console.log('Property created successfully!');
      console.log('Property ID:', propertyId);
      console.log('Main image URL:', mainImageUrl);
      console.log('Gallery images:', imageUrls);
      
      router.push('/admin/dashboard');
      
    } catch (error) {
      console.error('Error creating property:', error);
      setError('Failed to create property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Add New Property</h1>
          <Link href="/admin/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 1, message: 'Price must be greater than 0' }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location (City, State)
                </label>
                <input
                  type="text"
                  {...register('location', { required: 'Location is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Address
                </label>
                <input
                  type="text"
                  {...register('address', { required: 'Address is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type
                </label>
                <select
                  {...register('serviceType', { required: 'Service type is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Service Type</option>
                  <option value="property">Property</option>
                  <option value="land">Land</option>
                </select>
                {errors.serviceType && (
                  <p className="mt-1 text-sm text-red-600">{errors.serviceType.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  {...register('type', { required: 'Property type is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Loft">Loft</option>
                  <option value="Cabin">Cabin</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>                <select
                  {...register('status', { required: 'Status is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="For Sale">For Sale</option>
                  <option value="Sold">Sold</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  {...register('bedrooms', { 
                    required: 'Bedrooms is required',
                    min: { value: 0, message: 'Bedrooms must be 0 or more' }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.bedrooms && (
                  <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  {...register('bathrooms', { 
                    required: 'Bathrooms is required',
                    min: { value: 0, message: 'Bathrooms must be 0 or more' }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.bathrooms && (
                  <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area (sq ft)
                </label>
                <input
                  type="number"
                  {...register('area', { 
                    required: 'Area is required',
                    min: { value: 1, message: 'Area must be greater than 0' }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.area && (
                  <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  {...register('description', { required: 'Description is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features
                </label>
                <div className="flex">
                  <input
                    type="text"
                    ref={featuresInputRef}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a feature (e.g. Pool, Garden, etc.)"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Image
                </label>
                <input
                  type="file"
                  onChange={handleMainImageChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Images
                </label>
                <input
                  type="file"
                  onChange={handleImagesChange}
                  accept="image/*"
                  multiple
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    {...register('featured')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                    Feature this property on the homepage
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Property'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withAuth(NewPropertyPage);
