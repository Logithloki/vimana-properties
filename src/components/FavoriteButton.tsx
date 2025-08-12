'use client';

import React from 'react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/contexts/ToastContext';
import type { Property } from '@/utils';

interface FavoriteButtonProps {
  property: Property;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoriteButton({ property, className = '', size = 'md' }: FavoriteButtonProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { showToast } = useToast();
  const favorited = isFavorite(property.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (favorited) {
      removeFromFavorites(property.id);
      showToast('Property removed from favorites', 'info');
    } else {
      addToFavorites(property);
      showToast('Property added to favorites', 'success');
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        ${sizeClasses[size]}
        rounded-full 
        transition-all duration-300 
        ${favorited 
          ? 'bg-red-500 text-white shadow-lg hover:bg-red-600 hover:shadow-xl scale-110' 
          : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500 shadow-md hover:shadow-lg'
        }
        backdrop-blur-sm
        ${className}
      `}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg 
        className={`${iconSizeClasses[size]} transition-transform duration-300 ${favorited ? 'scale-110' : ''}`}
        fill={favorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={favorited ? 0 : 2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
    </button>
  );
}
