'use client';

import { useComparison } from '@/contexts/ComparisonContext';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare, compareCount } = useComparison();

  if (compareCount === 0) {
    return (
      <div className="pt-12 pb-16">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 py-16 mb-12 shadow-lg">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Property Comparison</h1>
            <p className="text-xl text-primary-100">Compare up to 3 properties side by side</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="max-w-md mx-auto">
              <svg className="w-24 h-24 text-primary-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">No Properties to Compare</h3>
              <p className="text-gray-600 mb-8">Start browsing properties and add them to comparison using the &quot;Compare&quot; button.</p>
              <Link href="/properties">
                <Button variant="primary" fullWidth>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Browse Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-16">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 py-16 mb-12 shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Property Comparison</h1>
          <p className="text-xl text-primary-100">
            Comparing {compareCount} propert{compareCount === 1 ? 'y' : 'ies'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Property Comparison</h2>
          <div className="flex gap-4">
            <Link href="/properties">
              <Button variant="outline">Add More Properties</Button>
            </Link>
            <Button variant="secondary" onClick={clearCompare}>
              Clear All
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className={`grid grid-cols-1 ${compareCount === 2 ? 'md:grid-cols-2' : compareCount === 3 ? 'lg:grid-cols-3' : ''} divide-x divide-gray-200`}>
            {compareList.map((property) => (
              <div key={property.id} className="p-6">
                {/* Property Header */}
                <div className="relative mb-4">
                  <button
                    onClick={() => removeFromCompare(property.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 z-10"
                    title="Remove from comparison"
                  >
                    ×
                  </button>
                  <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={property.mainImage || '/images/placeholder-property.jpg'}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                  <p className="text-2xl font-bold text-blue-600">${property.price.toLocaleString()}</p>
                </div>

                {/* Property Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Type:</span>
                      <p className="font-semibold">{property.type}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Status:</span>
                      <p className={`font-semibold ${property.status === 'For Sale' ? 'text-green-600' : 'text-red-600'}`}>
                        {property.status}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-lg">{property.bedrooms}</p>
                      <p className="text-gray-600">Bedrooms</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-lg">{property.bathrooms}</p>
                      <p className="text-gray-600">Bathrooms</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-lg">{property.area}</p>
                      <p className="text-gray-600">sq ft</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-medium text-gray-600 mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {property.features?.slice(0, 4).map((feature, idx) => (
                        <span key={idx} className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                      {property.features && property.features.length > 4 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          +{property.features.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 space-y-2">
                    <Link href={`/properties/${property.id}`}>
                      <Button variant="primary" fullWidth size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button variant="outline" fullWidth size="sm">
                        Contact Agent
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Tips */}
        <div className="mt-8 bg-primary-50 border border-primary-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary-800 mb-2">Comparison Tips</h3>
          <ul className="text-primary-700 text-sm space-y-1">
            <li>• Compare similar property types for the most meaningful results</li>
            <li>• Consider location, price per square foot, and amenities</li>
            <li>• Don&apos;t forget to factor in additional costs like HOA fees and property taxes</li>
            <li>• Schedule viewings for your top choices to get a better feel for each property</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
