'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Property } from '@/utils';
import Button from '@/components/Button';
import FavoriteButton from '@/components/FavoriteButton';
import MortgageCalculator from '@/components/MortgageCalculator';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [activeImage, setActiveImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
    useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setNotFound(false);
      
      try {
        // Import the direct property fetch function from consolidated utils index
        const { getPropertyById } = await import('@/utils');
        
        // Fetch the specific property by ID - much more efficient
        const fetchedProperty = await getPropertyById(id as string);
        
        if (fetchedProperty) {
          setProperty(fetchedProperty);
          setActiveImage(fetchedProperty.mainImage || (fetchedProperty.images && fetchedProperty.images[0]) || '');
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPropertyDetails();
  }, [id]);
  if (isLoading) {
    return (
      <div className="pt-28 pb-16 bg-gradient-to-br from-white via-primary-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-300 rounded-full blur-xl opacity-20 animate-pulse"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4 relative"></div>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-primary-800">Loading Property...</h1>
            <p className="text-primary-600">Please wait while we fetch the property details.</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !property) {
    return (
      <div className="pt-28 pb-16 bg-gradient-to-br from-white via-primary-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 rounded-full text-sm font-bold mb-6 shadow-lg">
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse mr-3"></div>
              Property Not Found
            </div>
            <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-primary-800 via-primary-600 to-primary-800 bg-clip-text text-transparent">Property Not Found</h1>
            <p className="text-primary-600 mb-8 text-lg">The property you are looking for might have been removed or is no longer available.</p>
            <Link href="/properties">
              <Button variant="primary" className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 hover:from-primary-700 hover:via-primary-800 hover:to-primary-900 text-white font-bold rounded-xl transform hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Properties
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-28 pb-16 bg-gradient-to-br from-white via-primary-50 to-secondary-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-secondary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Property Main Image & Header Overlay */}
        <div className="mb-12 relative rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative h-[500px] w-full">
            <Image
              src={activeImage || '/images/property-placeholder.jpg'}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div> {/* Dark overlay for text readability */}
          </div>
          
          <div className="absolute inset-x-0 top-0 p-8 z-10 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div className="flex-1 mb-4 md:mb-0">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-3">
                  <div className="w-2 h-2 bg-primary-300 rounded-full animate-pulse mr-2"></div>
                  {property.type} • {property.status}
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-2 leading-tight">{property.title}</h1>
                <p className="text-lg text-gray-200">{property.address}</p>
              </div>
              <div className="flex items-center gap-6">
{/*<FavoriteButton property={property} size="lg" />*/} {/* Assuming FavoriteButton supports a light variant */}
                <div className="text-4xl font-black">
                  ${property.price.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {property.status === 'Sold' && (
            <div className="absolute top-0 right-0 bg-red-500 text-white px-8 py-3 z-20 transform rotate-45 translate-x-16 -translate-y-4 text-xl font-bold shadow-lg">
              SOLD
            </div>
          )}
        </div>

        {/* Property Images */}
        <div className="mb-12">
          <div className="grid grid-cols-4 gap-4">
            {property.images?.map((image, index) => (
              <div 
                key={index}
                className={`relative h-32 cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 group ${
                  activeImage === image 
                    ? 'border-primary-500 shadow-lg scale-105' 
                    : 'border-transparent hover:border-primary-300'
                }`}
                onClick={() => setActiveImage(image)}
              >
                <Image
                  src={image}
                  alt={`${property.title} - Image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-primary-100/50">
              <h2 className="text-2xl font-bold mb-6 text-primary-900">Description</h2>
              <p className="text-primary-700 leading-relaxed text-lg">{property.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-primary-100/50">
              <h2 className="text-2xl font-bold mb-6 text-primary-900">Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {property.features?.map((feature, index) => (
                  <li key={index} className="flex items-center text-primary-700 group">
                    <div className="relative mr-3">
                      <div className="absolute inset-0 bg-primary-200 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <svg className="w-6 h-6 text-primary-600 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mortgage Calculator */}
            {/* <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-primary-100/50">
              <MortgageCalculator propertyPrice={property.price} />
            </div> */}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-primary-100/50 sticky top-24">
              <h2 className="text-2xl font-bold mb-8 text-primary-900">Property Details</h2>
              
              <div className="space-y-6">
                {[
                  { label: 'Property Type', value: property.type },
                  { label: 'Status', value: property.status },
                  { label: 'Area', value: `${property.area} sq ft` },
                  { label: 'Bedrooms', value: property.bedrooms },
                  { label: 'Bathrooms', value: property.bathrooms },
                  { label: 'Location', value: property.location }
                ].map((detail, index) => (
                  <div key={index} className="flex justify-between items-center pb-4 border-b border-primary-100 group">
                    <span className="text-primary-600 group-hover:text-primary-700 transition-colors duration-300">{detail.label}:</span>
                    <span className="font-semibold text-primary-900 group-hover:text-primary-800 transition-colors duration-300">{detail.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-4">
                <Link href="/contact">
                  <Button 
                    variant="primary" 
                    fullWidth
                    className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 hover:from-primary-700 hover:via-primary-800 hover:to-primary-900 text-white font-bold rounded-xl transform hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-xl mb-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="relative z-10 flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Contact Agent
                    </span>
                  </Button>
                </Link>
                
                {/* <Link href={`tel:+1234567890`}>
                  <Button 
                    variant="outline" 
                    fullWidth
                    className="group relative overflow-hidden px-8 py-4 bg-white/95 hover:bg-white text-primary-700 border-2 border-primary-200 hover:border-primary-400 font-bold rounded-xl transform hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-100/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="relative z-10 flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call Now
                    </span>
                  </Button>
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}