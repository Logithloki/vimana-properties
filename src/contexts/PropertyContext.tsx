'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Property } from '@/utils';

interface PropertyContextType {
  properties: Property[];
  featuredProperties: Property[];
  isLoading: boolean;
  error: string | null;
  refreshProperties: () => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { getPropertiesFromFirebase, getFeaturedPropertiesFromFirebase } = await import('@/utils');
      
      // Fetch both all properties and featured properties in parallel
      const [allProperties, featured] = await Promise.all([
        getPropertiesFromFirebase(),
        getFeaturedPropertiesFromFirebase()
      ]);
      
      setProperties(allProperties);
      setFeaturedProperties(featured);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Failed to load properties');
      setProperties([]);
      setFeaturedProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProperties = async () => {
    await fetchProperties();
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const value = {
    properties,
    featuredProperties,
    isLoading,
    error,
    refreshProperties
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
}