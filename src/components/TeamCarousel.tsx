import { useEffect, useRef } from 'react';
import { motion, useMotionValue, wrap } from 'framer-motion';
import Link from 'next/link';

const CARD_WIDTH = 300; // Width of one card
const CARD_GAP = 24;    // Tailwind's gap-6 = 1.5rem = 24px
const SPEED = 1;        // Sliding speed

const TeamCarousel = ({ teamMembers }: { teamMembers: any[] }) => {
  const scrollX = useMotionValue(0);
  const x = useRef(0);

  const duplicated = [...teamMembers, ...teamMembers]; // For infinite loop

  useEffect(() => {
    const interval = setInterval(() => {
      const totalWidth = duplicated.length * (CARD_WIDTH + CARD_GAP);
      x.current = wrap(-totalWidth, 0, x.current - SPEED);
      scrollX.set(x.current);
    }, 16); // ~60 FPS

    return () => clearInterval(interval);
  }, [duplicated.length, scrollX]);

  return (
    
    <section className="relative">
      <div className="relative container mx-auto px-4 md:px-7 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-lg font-outfit font-normal text-gray-500 mb-1 border-l-2 border-r-2 border-black pl-2 pr-3 inline-block">
              Team Members
            </p>
            <br/>
            <br/>
            <h2 className="text-5xl md:text-5xl font-semibold font-outfit text-gray-900 mb-2">
              Meet The Awesome Team
            </h2>
            <br/>
            <p className="text-gray-600 text-lg max-w-xl">
              Realar help you easily create a real estate trading website. With the function Register, Login, Post real estate news.              </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex items-center text-sm font-semibold px-6 py-4 bg-slate-600 text-white rounded-full hover:bg-gray-900 transition duration-300 md:-mt-4 mb-7"
          >
            View all Team
            <svg
              className="w-4 h-4 ml-2"
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

        {/* Carousel */}
        <div className="overflow-hidden relative">
          <motion.div
            className="flex gap-6"
            style={{ x: scrollX }}
          >
            {duplicated.map((member, index) => (
              <div
                key={index}
                className="w-[300px] h-[500px] bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-[350px] object-cover"
                />
                <div className="h-[150px] p-4 bg-slate-100">
                  <h3 className="font-semibold text-gray-800 text-lg">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TeamCarousel;
