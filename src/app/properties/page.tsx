'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import PropertySearch from '@/components/PropertySearch';
import { useProperties } from '@/contexts/PropertyContext';
import type { Property } from '@/utils';
import { motion } from 'framer-motion';

function PropertiesContent() {
  const searchParams = useSearchParams();
  const { properties, isLoading } = useProperties();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [sortedProperties, setSortedProperties] = useState<Property[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(6);

  // Calculate pagination
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = sortedProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(sortedProperties.length / propertiesPerPage);
  // Filter properties based on search params
  useEffect(() => {
    if (properties.length === 0) return;
    
    let filtered = [...properties];
    const location = searchParams?.get('location');
    const type = searchParams?.get('type');
    const serviceType = searchParams?.get('serviceType');
    const minPrice = searchParams?.get('minPrice');
    const maxPrice = searchParams?.get('maxPrice');
    const status = searchParams?.get('status');
    const bedrooms = searchParams?.get('bedrooms');
    const bathrooms = searchParams?.get('bathrooms');
    const minArea = searchParams?.get('minArea');
    const maxArea = searchParams?.get('maxArea');
    
    // Reset to first page when filters change
    setCurrentPage(1);
    
    if (location) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(location.toLowerCase())
      );
    }
      if (type) {
      filtered = filtered.filter(property => property.type === type);
    }
    
    if (serviceType) {
      filtered = filtered.filter(property => property.serviceType === serviceType);
    }
    
    if (minPrice) {
      filtered = filtered.filter(property => property.price >= Number(minPrice));
    }
    
    if (maxPrice) {
      filtered = filtered.filter(property => property.price <= Number(maxPrice));
    }
    
    if (status) {
      filtered = filtered.filter(property => property.status === status);
    }
    
    if (bedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= Number(bedrooms));
    }
    
    if (bathrooms) {
      filtered = filtered.filter(property => property.bathrooms >= Number(bathrooms));
    }
    
    if (minArea) {
      filtered = filtered.filter(property => property.area >= Number(minArea));
    }
    
    if (maxArea) {
      filtered = filtered.filter(property => property.area <= Number(maxArea));
    }
    
    setFilteredProperties(filtered);
  }, [searchParams, properties]);
  
  // Sort properties based on selected option
  useEffect(() => {
    if (filteredProperties.length === 0) {
      setSortedProperties([]);
      return;    }
    
    const sorted = [...filteredProperties];
    
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Keep original order for newest
        break;
    }
    
    setSortedProperties(sorted);
    setCurrentPage(1); // Reset to first page when sorting changes
  }, [filteredProperties, sortBy]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-1 mt-12">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-600 hover:bg-primary-500 hover:text-white shadow-md'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* Page numbers */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="w-10 h-10 rounded-full bg-white text-gray-600 hover:bg-primary-500 hover:text-white shadow-md transition-colors duration-200"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
          </>
        )}

        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`w-10 h-10 rounded-full transition-colors duration-200 ${
              currentPage === number
                ? 'bg-primary-600 text-white font-bold shadow-lg scale-110'
                : 'bg-white text-gray-600 hover:bg-primary-500 hover:text-white shadow-md'
            }`}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="w-10 h-10 rounded-full bg-white text-gray-600 hover:bg-primary-500 hover:text-white shadow-md transition-colors duration-200"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-600 hover:bg-primary-500 hover:text-white shadow-md'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    );
  };
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="relative bg-cover bg-center py-24 sm:py-32" style={{ backgroundImage: "url('/images/hero-bg.svg')" }}>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Explore Our Exclusive Properties
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Find the perfect place to call home from our curated collection of luxury properties.
          </motion.p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <PropertySearch />
          </div>
          
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="mb-4 sm:mb-0">
                    <p className="text-gray-800 font-semibold text-lg">
                      <span className="text-primary-600 font-bold">{sortedProperties.length}</span> Properties Found
                    </p>
                    <p className="text-gray-500 text-sm">
                      Showing {indexOfFirstProperty + 1}-{Math.min(indexOfLastProperty, sortedProperties.length)} of {sortedProperties.length}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <label htmlFor="sort" className="text-sm text-gray-600 mr-3 font-medium">Sort by:</label>
                    <div className="relative">
                      <select 
                        id="sort" 
                        value={sortBy}
                        onChange={handleSortChange}
                        className="appearance-none border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm text-gray-700"
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="title">Alphabetical</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {currentProperties.length > 0 ? (
                  <>
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {currentProperties.map((property, index) => (
                        <motion.div
                          key={property.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <PropertyCard property={property} />
                        </motion.div>
                      ))}
                    </motion.div>
                    
                    {renderPagination()}
                  </>
                ) : (
                  <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <div className="max-w-md mx-auto">
                      <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <h3 className="text-2xl font-semibold mb-3 text-gray-800">No Properties Found</h3>
                      <p className="text-gray-600 mb-6">We couldn&apos;t find any properties matching your search criteria.</p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <p>Try adjusting your filters:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Change the location or expand your search area</li>
                          <li>Adjust the price range</li>
                          <li>Select a different property type</li>
                          <li>Remove some filters to see more results</li>                </ul>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function PropertiesPageLoading() {
  return (
    <div className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    </div>
  );
}

// Main page component wrapped with Suspense
export default function PropertiesPage() {
  return (
    <Suspense fallback={<PropertiesPageLoading />}>
      <PropertiesContent />
    </Suspense>
  );
}