'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Property } from '@/utils/data';
import PropertyCarousel from './PropertyCarousel';

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const propertiesRef = collection(db, 'properties');
        const featuredQuery = query(
          propertiesRef,
          where('featured', '==', true),
          limit(6)
        );

        const querySnapshot = await getDocs(featuredQuery);
        const fetchedProperties = querySnapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as Property[];

        setProperties(fetchedProperties);
      } catch (err) {
        console.error('Error fetching featured properties:', err);
        setError('Failed to load featured properties');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <div className="h-4 w-40 bg-gray-200 animate-pulse mb-2"></div>
              <div className="h-8 w-64 bg-gray-200 animate-pulse mb-2"></div>
              <div className="h-4 w-96 bg-gray-200 animate-pulse"></div>
            </div>
            <div className="h-10 w-40 bg-gray-200 animate-pulse rounded-full"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (properties.length === 0) return null;

  return (
    <section className="relative overflow-visible -mb-40 z-20">
      <div className="pt-20 pb-12 bg-[url('/images/pattern.svg')] bg-no-repeat bg-cover">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            {/* Left Text Content */}
            <div className="max-w-xl text-left">
              <p className="inline-block text-base sm:text-lg text-slate-900 font-outfit font-normal mb-2">
                <span className="block before:block before:w-16 before:h-[2px] before:bg-black before:mb-1 
          after:block after:w-16 after:h-[2px] after:bg-black after:mt-1">
                  Featured Properties
                </span>
              </p>
              <br />
              <br />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold font-outfit text-gray-900 mb-4">
                Featured Listings
              </h2>

              <p className="text-gray-600 font-inter font-medium text-base sm:text-lg leading-relaxed">
                Quis nulla blandit vulputate morbi adipiscing sem vestibulum. Nulla turpis integer dui sed posuere sem. Id molestie mi arcu gravida lorem potenti.
              </p>
            </div>

            {/* Right Button */}
            <Link
              href="/properties"
              className="inline-flex items-center text-base font-semibold px-6 py-4 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition duration-300"
            >
              View All Properties
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Property Carousel */}
      <div className="relative z-30">
        <PropertyCarousel properties={properties} />
      </div>
    </section>

  );
};

export default FeaturedProperties;
