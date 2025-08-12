'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { withAuth, Property, signOut } from '@/utils';
import { useProperties } from '@/contexts/PropertyContext';

const AdminDashboard = () => {
  const { properties, isLoading, refreshProperties } = useProperties();
  const router = useRouter();
  const [localProperties, setLocalProperties] = useState<Property[]>([]);
  const [selectedTab, setSelectedTab] = useState('all');

  // Keep a local copy for immediate UI updates after delete/update operations
  React.useEffect(() => {
    setLocalProperties(properties);
  }, [properties]);  const filteredProperties = selectedTab === 'all' 
    ? localProperties 
    : selectedTab === 'sold' 
      ? localProperties.filter(p => p.status === 'Sold')
      : localProperties.filter(p => p.status === 'For Sale');

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const { deletePropertyFromFirebase } = await import('@/utils');
        await deletePropertyFromFirebase(id);
        // Update local state immediately for better UX
        setLocalProperties(localProperties.filter((p: Property) => p.id !== id));
        // Refresh context data in background
        refreshProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property. Please try again.');
      }
    }
  };

  const handleMarkAsSold = async (id: string) => {
    try {
      const { updatePropertyStatus } = await import('@/utils');
      await updatePropertyStatus(id, 'Sold');
      // Update local state immediately for better UX
      setLocalProperties(localProperties.map((p: Property) => 
        p.id === id ? { ...p, status: 'Sold' } : p
      ));
      // Refresh context data in background
      refreshProperties();
    } catch (error) {
      console.error('Error marking property as sold:', error);
      alert('Failed to update property status. Please try again.');
    }
  };
  return (
    <div className="pt-28 pb-16 bg-emerald-50 min-h-screen">
      <div className="container mx-auto px-4">        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Admin Dashboard</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/admin/properties/new">
              <Button variant="primary">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Property
              </Button>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Properties</p>
                <p className="text-xl font-bold">{properties.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Available</p>
                <p className="text-xl font-bold">{properties.filter(p => p.status === 'For Sale').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Sold</p>
                <p className="text-xl font-bold">{properties.filter(p => p.status === 'Sold').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Featured</p>
                <p className="text-xl font-bold">{properties.filter(p => p.featured).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Property listings */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 font-medium ${selectedTab === 'all' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setSelectedTab('all')}
            >
              All Properties
            </button>
            <button
              className={`px-6 py-3 font-medium ${selectedTab === 'available' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setSelectedTab('available')}
            >
              Available
            </button>
            <button
              className={`px-6 py-3 font-medium ${selectedTab === 'sold' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setSelectedTab('sold')}
            >
              Sold
            </button>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <p>Loading properties...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="p-8 text-center">
              <p>No properties found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProperties.map(property => (
                    <tr key={property.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            <Image
                              src={property.mainImage || '/images/property-placeholder.jpg'}
                              alt={property.title}
                              fill
                              className="object-cover rounded-md"
                            />
                            {property.status === 'Sold' && (
                              <div className="absolute inset-0 bg-red-500 bg-opacity-70 flex items-center justify-center rounded-md">
                                <span className="text-white text-xs font-bold transform -rotate-45">SOLD</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{property.title}</div>
                            <div className="text-sm text-gray-500">{property.bedrooms} bed, {property.bathrooms} bath</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${property.price.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${property.status === 'For Sale' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'}`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {property.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {property.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/admin/properties/${property.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                          Edit
                        </Link>
                        {property.status !== 'Sold' && (
                          <button
                            onClick={() => handleMarkAsSold(property.id)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Mark as Sold
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(AdminDashboard);
