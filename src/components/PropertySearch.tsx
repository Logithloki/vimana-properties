'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PropertySearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [location, setLocation] = useState(searchParams?.get('location') || '');
  const [type, setType] = useState(searchParams?.get('type') || '');
  const [serviceType, setServiceType] = useState(searchParams?.get('serviceType') || '');
  const [minPrice, setMinPrice] = useState(searchParams?.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams?.get('maxPrice') || '');
  const [status, setStatus] = useState(searchParams?.get('status') || '');
  const [bedrooms, setBedrooms] = useState(searchParams?.get('bedrooms') || '');
  const [bathrooms, setBathrooms] = useState(searchParams?.get('bathrooms') || '');
  const [minArea, setMinArea] = useState(searchParams?.get('minArea') || '');
  const [maxArea, setMaxArea] = useState(searchParams?.get('maxArea') || '');
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  // Fetch unique property types from Firebase
  useEffect(() => {
    const loadPropertyTypes = async () => {      try {
        // Try to get properties from Firebase using consolidated utilities
        const { getPropertiesFromFirebase } = await import('@/utils');
        const properties = await getPropertiesFromFirebase();
        
        // Extract unique property types
        const types = [...new Set(properties.map(property => property.type))];
        setPropertyTypes(types);
      } catch (error) {
        console.error('Error loading property types:', error);
        // Set empty array if no properties available
        setPropertyTypes([]);
      }
    };
    
    loadPropertyTypes();
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    if (location) params.append('location', location);
    if (type) params.append('type', type);
    if (serviceType) params.append('serviceType', serviceType);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (status) params.append('status', status);
    if (bedrooms) params.append('bedrooms', bedrooms);
    if (bathrooms) params.append('bathrooms', bathrooms);
    if (minArea) params.append('minArea', minArea);
    if (maxArea) params.append('maxArea', maxArea);
    
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-gradient-to-br from-white via-primary-50 to-secondary-50 rounded-lg shadow-xl p-6 border border-primary-100/50">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Search Properties</h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              placeholder="City, state, or zip code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Any Type</option>
              {propertyTypes.map((propertyType) => (
                <option key={propertyType} value={propertyType}>
                  {propertyType}
                </option>
              ))}
            </select>
          </div>
            <div>
            <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
              Service Type
            </label>
            <select
              id="serviceType"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >              <option value="">Any Service</option>
              <option value="property">Property</option>
              <option value="land">Land</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <select
                id="minPrice"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">No Min</option>
                <option value="100000">$100,000</option>
                <option value="200000">$200,000</option>
                <option value="300000">$300,000</option>
                <option value="400000">$400,000</option>
                <option value="500000">$500,000</option>
                <option value="750000">$750,000</option>
                <option value="1000000">$1,000,000</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <select
                id="maxPrice"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">No Max</option>
                <option value="200000">$200,000</option>
                <option value="300000">$300,000</option>
                <option value="400000">$400,000</option>
                <option value="500000">$500,000</option>
                <option value="750000">$750,000</option>
                <option value="1000000">$1,000,000</option>
                <option value="1500000">$1,500,000</option>
                <option value="2000000">$2,000,000+</option>
              </select>
            </div>
          </div>
            <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Any Status</option>
              <option value="For Sale">For Sale</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
          
          {/* Bedrooms and Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <select
                id="bedrooms"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Any</option>
                <option value="1">1+ Bedrooms</option>
                <option value="2">2+ Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <select
                id="bathrooms"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Any</option>
                <option value="1">1+ Bathrooms</option>
                <option value="1.5">1.5+ Bathrooms</option>
                <option value="2">2+ Bathrooms</option>
                <option value="2.5">2.5+ Bathrooms</option>
                <option value="3">3+ Bathrooms</option>
                <option value="4">4+ Bathrooms</option>
              </select>
            </div>
          </div>
          
          {/* Area Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="minArea" className="block text-sm font-medium text-gray-700 mb-1">
                Min Area (sq ft)
              </label>
              <select
                id="minArea"
                value={minArea}
                onChange={(e) => setMinArea(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">No Min</option>
                <option value="500">500+ sq ft</option>
                <option value="750">750+ sq ft</option>
                <option value="1000">1,000+ sq ft</option>
                <option value="1250">1,250+ sq ft</option>
                <option value="1500">1,500+ sq ft</option>
                <option value="2000">2,000+ sq ft</option>
                <option value="2500">2,500+ sq ft</option>
                <option value="3000">3,000+ sq ft</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="maxArea" className="block text-sm font-medium text-gray-700 mb-1">
                Max Area (sq ft)
              </label>
              <select
                id="maxArea"
                value={maxArea}
                onChange={(e) => setMaxArea(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">No Max</option>
                <option value="1000">Up to 1,000 sq ft</option>
                <option value="1500">Up to 1,500 sq ft</option>
                <option value="2000">Up to 2,000 sq ft</option>
                <option value="2500">Up to 2,500 sq ft</option>
                <option value="3000">Up to 3,000 sq ft</option>
                <option value="4000">Up to 4,000 sq ft</option>
                <option value="5000">Up to 5,000 sq ft</option>
              </select>
            </div>
          </div>
            <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Search Properties
          </button>
        </div>
      </form>
    </div>
  );
}
