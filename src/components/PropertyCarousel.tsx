'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, easeInOut } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/utils/data';

const AUTOPLAY_INTERVAL = 3000;
const CARD_WIDTH = 360;
const SPACING = 60;

const PropertyCarousel = ({ properties }: { properties: Property[] }) => {
  const [centerIndex, setCenterIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCenterIndex((prev) => (prev + 1) % properties.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [properties.length]);

  const getPosition = (index: number) => {
    const diff = (index - centerIndex + properties.length) % properties.length;
    if (diff === 0) return 'center';
    if (diff === 1) return 'right';
    if (diff === properties.length - 1) return 'left';
    return 'hidden';
  };

  const variants = {
    center: {
      scale: 1.1,
      y: -20,
      opacity: 1,
      zIndex: 2,
      x: 0,
      pointerEvents: 'auto',
    },
    left: {
      scale: 0.9,
      y: 0,
      opacity: 0.6,
      zIndex: 1,
      x: -(CARD_WIDTH + SPACING),
      pointerEvents: 'auto',
    },
    right: {
      scale: 0.9,
      y: 0,
      opacity: 0.6,
      zIndex: 1,
      x: CARD_WIDTH + SPACING,
      pointerEvents: 'auto',
    },
    hidden: {
      scale: 0.7,
      opacity: 0,
      zIndex: 0,
      x: 0,
      pointerEvents: 'none',
    },
  };

  const transition = { duration: 0.6, ease: easeInOut };

  const renderCard = (property: Property, index: number) => {
    const position = getPosition(index);

    return (
      <motion.div
        key={property.id}
        className="absolute w-full max-w-xs sm:max-w-[300px] md:max-w-[360px] px-2 sm:px-0"
        initial="hidden"
        animate={position}
        exit="hidden"
        variants={variants}
        transition={transition}
      >
        <Link href={`/properties/${property.id}`}>
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl cursor-pointer">

            {/* Image Section */}
            <div className="relative h-64 w-full">
              <Image
                src={property.mainImage || '/images/placeholder-property.jpg'}
                alt={property.title}
                fill
                className="object-cover rounded-t-3xl"
                sizes="(max-width: 640px) 100vw, 360px"
                priority
              />
            </div>

            {/* Content */}
            <div className="px-4 sm:px-6 py-5 text-center">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 line-clamp-1">
                {property.title}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm mb-4 line-clamp-1">
                {property.location || property.address}
              </p>

              <div className="flex justify-center gap-6 text-gray-600 text-xs sm:text-sm mb-4 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-1">
                  <span className="material-icons text-sm sm:text-base">bed</span>
                  <span className="font-medium text-sm sm:text-base">{property.bedrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-icons text-sm sm:text-base">bathtub</span>
                  <span className="font-medium text-sm sm:text-base">{property.bathrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-icons text-sm sm:text-base">straighten</span>
                  <span className="font-medium text-sm sm:text-base">{property.area} sqft</span>
                </div>
              </div>

              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed px-2 sm:px-0 line-clamp-3">
                {property.description || 'No description available for this property.'}
              </p>
            </div>
          </div>
        </Link>
      </motion.div>

    );
  };

  return (
    <div className="relative h-[580px] overflow-hidden bg-[url('')] bg-cover bg-no-repeat py-16">
      <div className="relative w-full max-w-[1200px] mx-auto h-full flex justify-center items-center">
        <AnimatePresence initial={false}>
          {properties.map((property, index) => renderCard(property, index))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PropertyCarousel;
