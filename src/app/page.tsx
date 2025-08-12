'use client';

import Image from "next/image";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import FeaturedProperties from '@/components/FeaturedProperties';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import PropertyCard from '@/components/PropertyCard';
import { useProperties } from '@/contexts/PropertyContext';
import TestimonialCarousel from "@/components/Testimonials";
import TeamCarousel from "@/components/TeamCarousel";
import { Syne } from 'next/font/google'
import { FaTwitter, FaLinkedin } from 'react-icons/fa';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ContactFormData } from '@/utils';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  description?: string;
  twitter?: string;
  linkedin?: string;
}

export default function Home() {
  const { featuredProperties, properties: allProperties } = useProperties();
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState({
    hero: false,
    featured: false,
    whyChoose: false,
    stats: false,
    categories: false,
    testimonials: false
  });

  // Search form state
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchPriceRange, setSearchPriceRange] = useState('');

  // Contact form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<ContactFormData>();

  const heroRef = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLElement>(null);
  const whyChooseRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const categoriesRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);

  // Get different property types for categories section from all properties
  const propertyTypes = [...new Set(allProperties.map(property => property.type))];

  // Define state for testimonials
  const [indices, setIndices] = useState([0, 0, 0]);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const testimonials = [
    [
      { name: 'John D.', text: 'Excellent service and prompt responses every time.' },
      { name: 'Nimali S.', text: 'Truly the best in the real estate industry in Sri Lanka!' },
      { name: 'Arjun K.', text: 'Their professionalism and support was unmatched.' },
    ],
    [
      { name: 'Maya F.', text: 'They made my dream home a reality. Highly recommended!' },
      { name: 'Chathura W.', text: 'Super reliable and trustworthy group of professionals.' },
      { name: 'Luna R.', text: 'Prime Lands exceeded all my expectations.' },
    ],
    [
      { name: 'Dilshan P.', text: 'Impressed by their innovative approach to real estate.' },
      { name: 'Anika J.', text: 'Fantastic customer care and transparent process.' },
      { name: 'Ravi N.', text: 'I found the perfect plot in no time. Thank you, Prime!' },
    ],
  ];

  const enhancedTestimonials = [
    {
      id: 1,
      name: 'Ralph Edwards',
      role: 'Property Expert',
      content: 'Home is where love resides, memories are created, and dreams are nurtured. I have found my sanctuary in this beautiful property. Finding the perfect that resonates with your own.',
      avatar: '/images/ca.jpeg',
      propertyImage: '/images/ca2.jpeg',
      rating: 5
    },
    {
      id: 2,
      name: 'Andrew Simon',
      role: 'Property Expert',
      content: 'Home is where love resides, memories are created, and dreams are nurtured. I have found my sanctuary in this beautiful property. Finding the perfect that resonates with your own.',
      avatar: '/images/bo.jpeg',
      propertyImage: '/images/hav.jpeg',
      rating: 5
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      role: 'Property Expert',
      content: 'Home is where love resides, memories are created, and dreams are nurtured. I have found my sanctuary in this beautiful property. Finding the perfect that resonates with your own.',
      avatar: '/images/bo2.jpeg',
      propertyImage: '/images/have.jpeg',
      rating: 5
    }
  ];

  // Testimonials auto-rotate effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIndices((prev) => prev.map((i) => (i + 1) % 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced testimonials auto-rotate effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % enhancedTestimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [enhancedTestimonials.length]);

  // New testimonial section state
  const [currentIndex, setCurrentIndex] = useState(0);

  const newTestimonials = [
    {
      id: 1,
      name: 'Ralph Edwards',
      role: 'Property Client',
      content: 'Home is where love resides, memories are created, and dreams are nurtured. I have found my sanctuary in this beautiful property. Finding the perfect home that resonates with your own vision.',
      avatar: '/images/ca.jpeg',
      propertyImage: '/images/ca2.jpeg',
      rating: 5
    },
    {
      id: 2,
      name: 'Andrew Simon',
      role: 'Property Client',
      content: 'Working with Vimana Properties was an exceptional experience. They understood our needs perfectly and guided us through every step of finding our dream home with complete professionalism.',
      avatar: '/images/bo.jpeg',
      propertyImage: '/images/hav.jpeg',
      rating: 5
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      role: 'Investment Client',
      content: 'The investment opportunities provided by Vimana Properties have exceeded our expectations. Their market insights and professional approach made our investment journey smooth and profitable.',
      avatar: '/images/bo2.jpeg',
      propertyImage: '/images/have.jpeg',
      rating: 5
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (newTestimonials.length - 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (newTestimonials.length - 1)) % (newTestimonials.length - 1));
  };

  const images = [
    "/images/property1.jpg",
    "/images/property2.jpg",
    "/images/property3.jpg",
    "/images/property4.jpg",
  ];


  const timelineData = [
    { year: "2005", title: "Founded", description: "Company was founded with a vision to innovate in real estate." },
    { year: "2010", title: "First Major Project", description: "Completed the first large scale residential complex." },
    { year: "2015", title: "Expansion", description: "Expanded operations to three new cities." },
    { year: "2020", title: "Innovation Award", description: "Received prestigious award for sustainability in construction." },
    { year: "2025", title: "Future Vision", description: "Planning smart city projects leveraging latest technology." },
  ];
  const [visibleItems, setVisibleItems] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const indexStr = entry.target.getAttribute("data-index");
          if (entry.isIntersecting && indexStr !== null) {
            const index = Number(indexStr);
            setVisibleItems((prev) => ({ ...prev, [index]: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    const items = document.querySelectorAll(".timeline-item");
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);
  // Adding containerRef as dependency to be safe


  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse movement effect for hero section
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle window resize for responsive auto-scroll
  useEffect(() => {
    const handleResize = () => {
      // Reset scroll position on window resize
      const container = document.getElementById('featured-properties-container');
      if (container) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
        setCurrentScrollIndex(0);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const targetId = entry.target.getAttribute('data-section');
          if (targetId) {
            setIsVisible(prev => ({
              ...prev,
              [targetId]: true
            }));
          }
        }
      });
    }, observerOptions);

    const sections = [heroRef, featuredRef, whyChooseRef, statsRef, categoriesRef, testimonialsRef];
    sections.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // Auto-scroll featured properties
  const [isHovered, setIsHovered] = useState(false);

  // Team Members section state
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [isHoveredMember, setIsHoveredMember] = useState<number | null>(null);
  const [visibleMembers, setVisibleMembers] = useState(3);

  // Handle responsive team display
  useEffect(() => {
    const handleTeamResponsive = () => {
      if (window.innerWidth < 768) {
        setVisibleMembers(1);
      } else if (window.innerWidth < 1024) {
        setVisibleMembers(2);
      } else {
        setVisibleMembers(3);
      }
    };

    handleTeamResponsive();
    window.addEventListener('resize', handleTeamResponsive);
    return () => window.removeEventListener('resize', handleTeamResponsive);
  }, []);

  // Team Members Data
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Sara Prova",
      role: "Property Expert",
      image: "/images/ca.jpeg",
      description: "Expert in luxury properties with over 10 years of experience.",
      twitter: "https://twitter.com/saraprova",
      linkedin: "https://linkedin.com/in/saraprova"
    },
    {
      id: 2,
      name: "Janny Mari",
      role: "Property Expert",
      image: "/images/ca2.jpeg",
      description: "Specialized in residential properties and customer relations.",
      twitter: "https://twitter.com/jannymari",
      linkedin: "https://linkedin.com/in/jannymari"
    },
    {
      id: 3,
      name: "Michel Smith",
      role: "Property Expert",
      image: "/images/bo.jpeg",
      description: "Commercial property specialist with extensive market knowledge.",
      twitter: "https://twitter.com/michelsmith",
      linkedin: "https://linkedin.com/in/michelsmith"
    },
    {
      id: 4,
      name: "Robert Johnson",
      role: "Sales Manager",
      image: "/images/bo2.jpeg",
      description: "Leading our sales team with innovative strategies.",
      twitter: "https://twitter.com/robertjohnson",
      linkedin: "https://linkedin.com/in/robertjohnson"
    },
    {
      id: 5,
      name: "Sophia Lee",
      role: "Marketing Director",
      image: "/images/ca3.jpeg",
      description: "Creating impactful marketing campaigns for our properties.",
      twitter: "https://twitter.com/sophialee",
      linkedin: "https://linkedin.com/in/sophialee"
    }
  ];

  useEffect(() => {
    if (featuredProperties.length === 0) return;

    if (isHovered) {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
      return;
    }

    autoScrollRef.current = setInterval(() => {
      const container = document.getElementById('featured-properties-container');
      if (container) {
        const cardWidth = window.innerWidth >= 768 ? 320 : 288;
        const gap = 24;
        const scrollAmount = cardWidth + gap;
        const maxScrollLeft = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft + scrollAmount >= maxScrollLeft) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
          setCurrentScrollIndex(0);
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          setCurrentScrollIndex(prev => (prev + 1) % featuredProperties.length);
        }
      }
    }, 4000);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [featuredProperties, isHovered]);

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (searchLocation) params.append('location', searchLocation);
    if (searchType) params.append('type', searchType);

    // Handle price range conversion
    if (searchPriceRange) {
      if (searchPriceRange.includes('-')) {
        const [min, max] = searchPriceRange.split('-');
        if (min) params.append('minPrice', min);
        if (max) params.append('maxPrice', max);
      } else if (searchPriceRange.includes('+')) {
        const min = searchPriceRange.replace('+', '');
        params.append('minPrice', min);
      }
    }

    router.push(`/properties?${params.toString()}`);
  };

  // Handle contact form submission
  const onContactSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }

      const result = await response.json();
      console.log('Form submitted successfully:', result);
      
      setSubmitSuccess(true);
      reset();
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error instanceof Error ? error.message : 'An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (featuredProperties.length > 0) {
      autoScrollRef.current = setInterval(() => {
        const container = document.getElementById('featured-properties-container');
        if (container) {
          setCurrentScrollIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % featuredProperties.length;
            // Calculate scroll position based on card width + gap
            const cardWidth = window.innerWidth >= 768 ? 384 : 320;
            const gap = 24;
            const scrollPosition = nextIndex * (cardWidth + gap);
            container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
            return nextIndex;
          });
        }
      }, 4000);
    }
  };

  // Featured Properties Section
  const [dragConstraints, setDragConstraints] = useState({ right: 0, left: -900 });
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sliderRef.current) {
      const width = sliderRef.current.scrollWidth - sliderRef.current.offsetWidth;
      setDragConstraints({ right: 0, left: -width });
    }
  }, []);

  const [years, setYears] = useState(0);
  const [properties, setProperties] = useState(0);
  const [customers, setCustomers] = useState(0);

  // Animate numbers on mount
  useEffect(() => {
    const animateCount = (end: any, setter: any) => {
      let current = 0;
      const duration = 1000;
      const step = Math.ceil(end / (duration / 16));
      const interval = setInterval(() => {
        current += step;
        if (current >= end) {
          current = end;
          clearInterval(interval);
        }
        setter(current);
      }, 16);
    };

    animateCount(6, setYears);
    animateCount(72, setProperties);
    animateCount(81, setCustomers);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen bg-[url('hex-pattern.svg')] bg-cover bg-no-repeat">
        {/* Right-side Image */}
        <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block overflow-hidden shadow-xl">
          <img
            src="/images/homepage.jpg"
            alt="Luxury Property"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.svg')] opacity-5 mix-blend-overlay"></div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 pt-32 sm:pt-36 md:pt-40">
          <div className="max-w-3xl">
            <h3 className="text-xl sm:text-2xl font-outfit font-normal text-gray-800 mb-2 sm:mb-3">
              A lifestyle Beyond Expectation
            </h3>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-outfit font-semibold text-gray-800 leading-tight mb-4">
              Where Dreams<br />Meet Reality
            </h1>

            {/* Search Form */}
            <div className="w-full flex flex-col lg:flex-row h-auto lg:h-20 max-w-6xl bg-white rounded-xl shadow-md overflow-hidden mt-6">
              {/* Input */}
              <div className="flex items-center px-4 py-3 flex-1">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1016.65 2a7.5 7.5 0 000 14.65z" />
                </svg>
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-full text-sm font-inter placeholder:text-sm focus:outline-none"
                />
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px bg-gray-300 my-6" />

              {/* Category */}
              <div className="flex items-center px-4 py-3">
                <select className="bg-transparent text-sm font-inter focus:outline-none w-full">
                  <option>Category</option>
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Commercial</option>
                  <option>Land</option>
                </select>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px bg-gray-300 my-6" />

              {/* Location */}
              <div className="flex items-center px-4 py-3">
                <select className="bg-transparent text-sm font-inter focus:outline-none w-full">
                  <option>Location</option>
                  <option>Colombo</option>
                  <option>Gampaha</option>
                  <option>Kandy</option>
                  <option>Galle</option>
                </select>
              </div>

              {/* Search Button */}
              <button className="bg-gray-800 text-white text-sm font-semibold font-inter px-6 py-3 lg:py-0 hover:bg-gray-900 transition w-full lg:w-auto flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1016.65 2a7.5 7.5 0 000 14.65z" />
                </svg>
                Search Property
              </button>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="flex flex-col sm:flex-row sm:space-x-12 mt-10">
            <div className="text-left mb-6 sm:mb-0">
              <h2 className="text-3xl sm:text-4xl font-semibold text-black font-outfit">{years}</h2>
              <p className="text-gray-800 mt-2 font-outfit font-semibold text-base leading-snug">Years Of Experience</p>
            </div>
            <div className="text-left mb-6 sm:mb-0">
              <h2 className="text-3xl sm:text-4xl font-semibold text-black font-outfit">{properties}</h2>
              <p className="text-gray-800 mt-2 font-outfit font-semibold text-base leading-snug">Verified Properties</p>
            </div>
            <div className="text-left">
              <h2 className="text-3xl sm:text-4xl font-semibold text-black font-outfit">{customers}</h2>
              <p className="text-gray-800 mt-2 font-outfit font-semibold text-base leading-snug">Satisfied Customers</p>
            </div>
          </div>

          {/* Feature Cards (still hidden) */}
          <div className="hidden grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-lg p-6 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary-50 rounded-full">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l7 7-7-7-7-7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold ml-3">Quality Properties</h3>
              </div>
              <p className="text-gray-600">High-standard properties in prime locations.</p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white rounded-lg p-6 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary-50 rounded-full">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold ml-3">Fast & Easy</h3>
              </div>
              <p className="text-gray-600">Quick and efficient property search process.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Welcome Section */}
      <section className="bg-[url('hex-pattern.svg')] bg-cover bg-no-repeat py-12 sm:py-16 lg:py-20 px-4 z-10">
        <div className="sm:px-6 lg:px-12 lg:pl-36">
          <div className="flex flex-col md:flex-row justify-between items-start space-y-10 md:space-y-0 md:space-x-12">

            {/* Left Column */}
            <div className="w-full md:w-1/2 text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-800 leading-snug font-outfit">
                Welcome To
                <br />
                <span className="text-gray-800">Vimana Properties</span>
              </h2>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-1/2 text-left">
              <p className="text-gray-700 leading-relaxed font-inter mb-6 text-base sm:text-lg md:text-xl">
                Turning homes become dreams as your go-to real estate agent. You can rely on us to help you safely home.
                <br />
                745,000 houses and flats for sale, rent, or mortgage.
              </p>
              <button className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2">
                Request a visit
                <span className="ml-1">→</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <div id="featured-properties" className="bg-[url('hex-pattern.svg')] bg-cover bg-no-repeat">
        <FeaturedProperties />
      </div>

      {/* About Us Section */}
      <section id="about" className="relative bg-[#a1b5b6] text-black px-4 pt-24 z-10">
        <div className="relative container mx-auto px-4 sm:px-6 md:px-12 lg:px-12 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-7 max-w-xl text-left">
              <p className="inline-block text-base sm:text-lg text-slate-900 font-outfit font-normal mb-1">
                <span className="block before:block before:w-12 before:h-[2px] before:bg-black before:mb-1 after:block after:w-12 after:h-[2px] after:bg-black after:mt-1">
                  About Us
                </span>
              </p>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold font-outfit text-black leading-tight">
                We Are Simply What You Haven't Imagined Yet.
              </h2>

              <p className="text-gray-900 font-inter font-medium text-base sm:text-lg">
                Vimana Properties — where tradition meets opportunity.
              </p>
              <p className="text-gray-900 font-inter font-medium text-base sm:text-lg">
                "Based in the heart of Sri Lanka's cultural capital, we bring more than just property expertise — we bring passion, insight, and a commitment to your vision."
              </p>
              <p className="text-gray-900 font-inter font-medium text-base sm:text-lg">
                "Whether you're looking for your dream home, a smart investment, or the perfect commercial space, our portfolio is built on elegance, functionality, and long-term value."
              </p>

              <div className="flex flex-col md:flex-row items-start justify-start gap-8">
                {/* Features List */}
                <div className="space-y-4 text-base sm:text-lg font-inter font-medium text-gray-900 flex-1">
                  {[
                    "Quality real estate services",
                    "100% Satisfaction guarantee",
                    "Highly professional team",
                    "Dealing always on time",
                  ].map((text, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-gray-900 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px bg-gray-900 h-40 mx-8"></div>

                {/* Contact Info */}
                <div className="flex flex-col items-start gap-4">
                  <div className="p-3 bg-black rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.72 11.72 0 003.69.59 1 1 0 011 1V20a1 1 0 01-1 1C10.74 21 3 13.26 3 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.69 1 1 0 01-.21 1.11l-2.26 2.26z" />
                      <path d="M15.05 5.05a7 7 0 014.95 4.95m-2.83-7.78a10 10 0 016.36 6.36" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-inter font-semibold mb-1">Call Us 24/7</p>
                    <p className="text-base font-bold text-gray-900 font-inter">+01 234 56789</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-8">
                <button className="bg-gray-800 text-white py-3 px-6 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-gray-900 transition-all">
                  More About Vimana Properties
                  <span className="text-xl">→</span>
                </button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative w-full h-[350px] sm:h-[450px] md:h-[600px] lg:h-[700px] rounded-3xl shadow-xl overflow-hidden mb-12 md:mb-0">
              <Image
                src="/images/ca2.jpeg"
                alt="Main Office"
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-700 hover:scale-110"
                priority
              />
            </div>
          </div>
        </div>
      </section>


      {/* Team Members Section */}
      <section id="team" className="bg-white px-4 py-16 sm:py-24">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side: Text content */}
            <div className="text-left h-[400px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {isHoveredMember === null ? (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-4 font-outfit">
                      Welcome our talented team
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 font-inter">
                      These individuals are the heart and soul of our product.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-block bg-gray-800 text-white font-semibold py-3 px-8 rounded-full hover:bg-gray-900 transition-colors duration-300 font-inter"
                    >
                      View All Team Members
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    key={isHoveredMember}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col justify-center"
                  >
                    {teamMembers.find(m => m.id === isHoveredMember) && (
                      <>
                        <h3 className="text-3xl font-bold font-outfit text-gray-900">{teamMembers.find(m => m.id === isHoveredMember)?.name}</h3>
                        <p className="text-lg text-gray-700 font-inter mb-4">{teamMembers.find(m => m.id === isHoveredMember)?.role}</p>
                        <p className="text-base text-gray-600 font-inter mb-6">
                          {teamMembers.find(m => m.id === isHoveredMember)?.description}
                        </p>
                        <div className="flex gap-4 text-gray-800">
                          {teamMembers.find(m => m.id === isHoveredMember)?.twitter && (
                            <a href={teamMembers.find(m => m.id === isHoveredMember)?.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-black">
                              <FaTwitter size={24} />
                            </a>
                          )}
                          {teamMembers.find(m => m.id === isHoveredMember)?.linkedin && (
                            <a href={teamMembers.find(m => m.id === isHoveredMember)?.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-black">
                              <FaLinkedin size={24} />
                            </a>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right side: Team members */}
            <div 
              className="flex gap-4 overflow-x-auto hide-scrollbar"
              onMouseLeave={() => setIsHoveredMember(null)}
            >
              {teamMembers.slice(0, ).map((member, index) => (
                <motion.div
                  key={member.id}
                  className="relative min-w-[200px] md:min-w-[240px] rounded-2xl overflow-hidden cursor-pointer"
                  onMouseEnter={() => setIsHoveredMember(member.id)}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-[400px] object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <div id="testimonials">
        <TestimonialCarousel testimonials={newTestimonials} />
      </div>

      {/* Property Types Section */}
      <section className="bg-slate-700 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-outfit font-semibold text-white mb-2">Browse Property Types</h2>
            <p className="text-slate-300 font-inter font-medium">Find your perfect property based on your preferences</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-16">
            {[
              {
                id: 1,
                title: 'House',
                subtitle: 'Single Family Home',
                type: 'House',
                icon: (
                  <svg className="w-12 h-12 text-white" viewBox="0 0 48 48" fill="currentColor">
                    <path d="M24 4L8 20v24h32V20L24 4zm0 6.83L36 22v18H12V22L24 10.83zM20 24v12h-4V24h4zm6 0v12h-4V24h4zm6 0v12h-4V24h4z" />
                  </svg>
                )
              },
              {
                id: 2,
                title: 'Town',
                subtitle: 'Urban Properties',
                type: 'Town',
                icon: (
                  <svg className="w-12 h-12 text-white" viewBox="0 0 48 48" fill="currentColor">
                    <path d="M8 8v32h32V8H8zm4 4h8v12h-8V12zm12 0h8v24h-8V12zm12 0h4v8h-4v-8zm0 12h4v12h-4V24zM12 28h8v12h-8V28z" />
                  </svg>
                )
              },
              {
                id: 3,
                title: 'Villa',
                subtitle: 'Luxury Living',
                type: 'Villa',
                icon: (
                  <svg className="w-12 h-12 text-white" viewBox="0 0 48 48" fill="currentColor">
                    <path d="M24 4L8 16v28h32V16L24 4zm0 6.83L36 18v22H12V18L24 10.83zM16 22h4v10h-4V22zm6 0h4v10h-4V22zm6 0h4v10h-4V22z" />
                  </svg>
                )
              },
              {
                id: 4,
                title: 'Townhouse',
                subtitle: 'Connected Living',
                type: 'townhouse',
                icon: (
                  <svg className="w-12 h-12 text-white" viewBox="0 0 48 48" fill="currentColor">
                    <path d="M4 8v32h40V8H4zm4 4h10v24H8V12zm12 0h8v24h-8V12zm10 0h10v24H30V12zm-18 6h4v6h-4v-6zm10 0h4v6h-4v-6zm10 0h4v6h-4v-6zm-20 8h4v8h-4v-8zm10 0h4v8h-4v-8zm10 0h4v8h-4v-8z" />
                  </svg>
                )
              },
              {
                id: 5,
                title: 'Apartment',
                subtitle: 'Modern Design',
                type: 'Apartment',
                icon: (
                  <svg className="w-12 h-12 text-white" viewBox="0 0 48 48" fill="currentColor">
                    <path d="M24 4L8 16v28h32V16L24 4zm-8 18h4v16h-4V22zm8 0h4v16h-4V22zm8 0h4v16h-4V22z" />
                  </svg>
                )
              },
              {
                id: 6,
                title: 'Cabin',
                subtitle: 'Nature Retreat',
                type: 'Cabin',
                icon: (
                  <svg className="w-12 h-12 text-white" viewBox="0 0 48 48" fill="currentColor">
                    <path d="M24 4L8 16v28h32V16L24 4zm-8 18h4v16h-4V22zm8 0h4v16h-4V22zm8 0h4v16h-4V22z" />
                  </svg>
                )
              }
            ].map((propertyType) => (
              <motion.div
                key={propertyType.id}
                className="flex flex-col items-center text-center min-w-[120px] group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: propertyType.id * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                onClick={() => router.push(`/properties?type=${propertyType.type}`)}
              >
                <div className="mb-3 p-2 group-hover:scale-110 transition-transform duration-300">
                  {propertyType.icon}
                </div>
                <h3 className="text-white font-outfit text-xl font-medium mb-1 max-w-[100px] leading-tight">
                  {propertyType.title}
                </h3>
                <p className="text-slate-300 font-outfit text-base font-normal opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  {propertyType.subtitle}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section - Enhanced Dark Blue Theme */}
      <motion.section
        id="contact"
        className="bg-[#A4B5BA] text-[#0f1a3c] px-6 md:px-20 py-24 font-inter text-base font-normal"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          {/* Left Side - Text */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="inline-block text-lg text-slate-900 font-outfit font-normal mb-1">
              <span className="block before:block before:w-12 before:h-[2px] before:bg-black before:mb-1 
          after:block after:w-12 after:h-[2px] after:bg-black after:mt-1">
                Contact Us
              </span>
            </p>            <h2 className="text-5xl font-semibold font-inter leading-tight text-gray-900">
              Let's Find Your Dream Property Together
            </h2>
            <p className="text-gray-600 leading-relaxed font-inter font-normal text-lg">
              Whether you're looking to buy, sell, or just have questions about real estate,
              our expert team is here to help. Reach out to us, and we'll get back to you promptly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-inter font-semibold text-gray-900">Phone</h3>
                  <p className="mt-1 text-gray-600 font-inter">+94 11 123 4567</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold font-inter text-gray-900">Email</h3>
                  <p className="mt-1 text-gray-600 font-inter">info@vimanaproperties.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            className="bg-white rounded-lg shadow-xl p-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                  <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent Successfully!</h3>
                  <p className="text-green-700">Thank you for contacting us. We'll get back to you shortly.</p>
                </div>
                <motion.button
                  onClick={() => setSubmitSuccess(false)}
                  className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Another Message
                </motion.button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onContactSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium font-inter text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium font-inter text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium font-inter text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium font-inter text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    {...register('message', { required: 'Message is required' })}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors`}
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">{submitError}</p>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full font-inter text-white py-3 rounded-lg transition-colors duration-200 ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
