'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Property } from '@/utils';

interface ComparisonContextType {
  compareList: Property[];
  addToCompare: (property: Property) => void;
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
  isInCompare: (propertyId: string) => boolean;
  compareCount: number;
  maxCompareItems: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<Property[]>([]);
  const maxCompareItems = 3; // Maximum properties that can be compared at once

  // Load comparison list from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCompareList = localStorage.getItem('realEstateCompare');
      if (savedCompareList) {
        try {
          const parsedCompareList = JSON.parse(savedCompareList);
          setCompareList(parsedCompareList);
        } catch (error) {
          console.error('Error parsing saved comparison list:', error);
        }
      }
    }
  }, []);

  // Save comparison list to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('realEstateCompare', JSON.stringify(compareList));
    }
  }, [compareList]);

  const addToCompare = (property: Property) => {
    setCompareList(prev => {
      // Check if property is already in compare list
      if (prev.some(item => item.id === property.id)) {
        return prev;
      }
      
      // Check if we've reached the maximum
      if (prev.length >= maxCompareItems) {
        // Remove the first item and add the new one
        return [...prev.slice(1), property];
      }
      
      return [...prev, property];
    });
  };

  const removeFromCompare = (propertyId: string) => {
    setCompareList(prev => prev.filter(item => item.id !== propertyId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (propertyId: string) => {
    return compareList.some(item => item.id === propertyId);
  };

  const value = {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    compareCount: compareList.length,
    maxCompareItems,
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
