'use client';

import { useFavorites } from '@/contexts/FavoritesContext';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';
import Button from '@/components/Button';

export default function FavoritesPage() {
  const { favorites, favoritesCount } = useFavorites();

  return (
    <div className="pt-12 pb-16">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 py-16 mb-12 shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">My Favorites</h1>
          <p className="text-xl text-primary-100">
            {favoritesCount > 0 
              ? `You have ${favoritesCount} favorite propert${favoritesCount === 1 ? 'y' : 'ies'} saved`
              : 'Start exploring properties and save your favorites here'
            }
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {favorites.length > 0 ? (
          <>
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-lg shadow-md">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Saved Properties</h2>
                  <p className="text-gray-600">
                    {favorites.length} propert{favorites.length === 1 ? 'y' : 'ies'} in your favorites list
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Link href="/properties">
                    <Button variant="outline">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Browse More Properties
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {favorites.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="max-w-md mx-auto">
              <svg className="w-24 h-24 text-primary-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">No Favorites Yet</h3>
              <p className="text-gray-600 mb-8">Start exploring our properties and save your favorites by clicking the heart icon.</p>
              <div className="space-y-4">
                <Link href="/properties">
                  <Button variant="primary" fullWidth>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Browse Properties
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" fullWidth>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Go to Homepage
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
