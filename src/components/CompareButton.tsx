'use client';

import React from 'react';
import { useComparison } from '@/contexts/ComparisonContext';
import { useToast } from '@/contexts/ToastContext';
import type { Property } from '@/utils';

interface CompareButtonProps {
  property: Property;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CompareButton({ property, className = '', size = 'md' }: CompareButtonProps) {
  const { isInCompare, addToCompare, removeFromCompare, compareCount, maxCompareItems } = useComparison();
  const { showToast } = useToast();
  const inCompare = isInCompare(property.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inCompare) {
      removeFromCompare(property.id);
      showToast('Property removed from comparison', 'info');
    } else {
      if (compareCount >= maxCompareItems) {
        showToast(`You can compare up to ${maxCompareItems} properties at a time`, 'warning');
        return;
      }
      addToCompare(property);
      showToast('Property added to comparison', 'success');
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-sm'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        ${sizeClasses[size]}
        rounded-md 
        transition-all duration-300 
        flex items-center gap-1
        ${inCompare 
          ? 'bg-green-500 text-white shadow-lg hover:bg-green-600' 
          : 'bg-white/80 text-gray-600 hover:bg-white hover:text-green-500 shadow-md hover:shadow-lg border border-gray-200'
        }
        backdrop-blur-sm
        ${className}
      `}
      title={inCompare ? 'Remove from comparison' : 'Add to comparison'}
      disabled={!inCompare && compareCount >= maxCompareItems}
    >
      <svg 
        className={`${iconSizeClasses[size]} transition-transform duration-300`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
        />
      </svg>
      {inCompare ? 'Remove' : 'Compare'}
    </button>
  );
}
