'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Property } from '@/utils';

interface FavoritesContextType {
  favorites: Property[];
  addToFavorites: (property: Property) => void;
  removeFromFavorites: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Property[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('realEstateFavorites');
      if (savedFavorites) {
        try {
          const parsedFavorites = JSON.parse(savedFavorites);
          setFavorites(parsedFavorites);
        } catch (error) {
          console.error('Error parsing saved favorites:', error);
        }
      }
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('realEstateFavorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const addToFavorites = (property: Property) => {
    setFavorites(prev => {
      // Check if property is already in favorites
      if (prev.some(fav => fav.id === property.id)) {
        return prev;
      }
      return [...prev, property];
    });
  };

  const removeFromFavorites = (propertyId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== propertyId));
  };

  const isFavorite = (propertyId: string) => {
    return favorites.some(fav => fav.id === propertyId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    favoritesCount: favorites.length,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
