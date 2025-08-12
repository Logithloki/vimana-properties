'use client';

import { motion, useMotionValue, useAnimationFrame, wrap } from 'framer-motion';
import Link from 'next/link';

const TestimonialCarousel = ({ testimonials }: { testimonials: any[] }) => {
  const scrollX = useMotionValue(0);
  const speed = 1.5;

  const duplicatedTestimonials = [...testimonials, ...testimonials];
  const itemWidth = 900;
  const totalWidth = testimonials.length * itemWidth;

  useAnimationFrame(() => {
    const prev = scrollX.get();
    const next = wrap(-totalWidth, 0, prev - speed);
    scrollX.set(next);
  });

  return (
    <section className="bg-[#A4B5BA] py-16 overflow-hidden px-4 pt-24 z-10">
      <div className="mx-auto px-4 sm:px-6 md:px-12 lg:px-28">
        {/* Heading */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="inline-block text-lg text-slate-900 font-outfit font-normal mb-1">
              <span className="block before:block before:w-12 before:h-[2px] before:bg-black before:mb-1 after:block after:w-12 after:h-[2px] after:bg-black after:mt-1">
                Testimonial
              </span>
            </p>
            <br />
            <br />
            <h2 className="text-4xl md:text-5xl font-semibold font-outfit text-black mb-2">
              What Our Customers Say
            </h2>
            <br />
            <p className="text-gray-700 max-w-xl text-lg font-inter font-medium">
              Hear from clients who have experienced with <br /> Vimana Properties. Learn from real success story.
            </p>
          </div>
        </div>

        {/* Desktop Slider */}
        <div className="relative overflow-hidden hidden sm:block">
          <motion.div className="flex gap-0" style={{ x: scrollX }}>
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="w-full sm:w-[500px] md:w-[700px] lg:w-[900px] flex-shrink-0 relative"
              >
                {/* Image */}
                <div className="rounded-2xl overflow-hidden shadow-xl sm:w-[40%] md:w-[45%] relative mx-auto">
                  <img
                    src={testimonial.propertyImage}
                    alt="Property"
                    className="w-full h-[220px] sm:h-[260px] md:h-[300px] object-cover"
                  />
                </div>

                {/* Overlay text */}
                <div className="absolute inset-x-4 sm:right-[40%] top-1/2 transform -translate-y-1/2 w-full sm:w-[80%] md:w-[40%] bg-white rounded-2xl p-6 shadow-lg mx-auto">
                  <div className="absolute top-3 right-3">
                    <span className="text-4xl text-orange-300">&ldquo;</span>
                  </div>

                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-slate-700 text-base leading-relaxed mb-4">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-3 mt-4 border-t pt-3 border-slate-100">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{testimonial.name}</h4>
                      <p className="text-slate-500 text-xs">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden px-2">
          <motion.div className="flex gap-4" style={{ x: scrollX }}>
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="w-[90vw] max-w-[360px] sm:w-[500px] md:w-[700px] lg:w-[900px] flex-shrink-0 relative bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Image */}
                <img
                  src={testimonial.propertyImage}
                  alt="Property"
                  className="w-full h-[180px] sm:h-[260px] md:h-[300px] object-cover"
                />

                {/* Content */}
                <div className="p-4 sm:p-6 relative">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-3 border-t pt-3 border-slate-100">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{testimonial.name}</h4>
                      <p className="text-slate-500 text-xs">{testimonial.role}</p>
                    </div>
                  </div>

                  <span className="absolute bottom-3 right-4 text-2xl text-gray-300">&rdquo;</span>
                </div>
              </div>
            ))}
          </motion.div>
          {/* {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <img
                src={testimonial.propertyImage}
                alt="Property"
                className="w-full h-[180px] object-cover"
              />
              <div className="p-4 relative">
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: testimonial.rating }, (_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3 border-t pt-3 border-slate-100">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">{testimonial.name}</h4>
                    <p className="text-slate-500 text-xs">{testimonial.role}</p>
                  </div>
                </div>
                <span className="absolute bottom-3 right-4 text-2xl text-gray-300">&rdquo;</span>
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
