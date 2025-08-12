'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useComparison } from '@/contexts/ComparisonContext';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const { favoritesCount } = useFavorites();
  const { compareCount } = useComparison();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setScrolled(window.scrollY > 50);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    if (pathname !== '/') {
      window.location.href = `/#${sectionId}`;
    } else {
      const section = document.getElementById(sectionId);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
<header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/images/logo.jpg" alt="Vimana Properties" className="h-14 w-36 object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10 font-houschka">
            {['about', 'featured-properties', 'team', 'testimonials'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                type="button"
                className={`relative text-base font-outfit font-semibold transition-all duration-300 ease-in-out 
                  text-gray-700 hover:text-gray-900
                  before:content-[''] before:absolute before:left-0 before:-bottom-1 
                  before:h-[2px] before:w-0 hover:before:w-full 
                  before:bg-gray-900 before:transition-all before:duration-300 before:ease-in-out`}
              >
                {section === 'featured-properties' ? 'Projects' : section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}

            {/* Services Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center text-base font-outfit font-semibold text-gray-700 hover:text-gray-900 relative
                before:content-[''] before:absolute before:left-0 before:-bottom-1 
                before:h-[2px] before:w-0 hover:before:w-full 
                before:bg-gray-900 before:transition-all before:duration-300 before:ease-in-out"
              >
                Services
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300">
                <Link href="/properties?serviceType=property" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Property</Link>
                <Link href="/properties?serviceType=land" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Land</Link>
              </div>
            </div>

            {/* News Link
            <Link href="/news" className="text-base font-outfit font-semibold text-gray-700 hover:text-gray-900">
              News
            </Link> */}
          </nav>

          {/* Request A Visit Button + Hamburger */}
          <div className="flex items-center space-x-4">
            <Link
              href="/contact"
              className="hidden lg:inline-flex bg-gray-800 hover:bg-gray-900 text-white font-semibold font-outfit py-3 px-6 rounded-full transition-all duration-300"
            >
              Request a visit <span className="ml-1">→</span>
            </Link>

            {/* Hamburger for mobile */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-800 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="py-4 px-4 space-y-4">
            {/* <Link href="/" className="block text-gray-700 hover:text-primary-600">Home</Link> */}
            <button onClick={() => scrollToSection('about')} className="block text-left w-full text-gray-700 hover:text-primary-600">About</button>
            <button onClick={() => scrollToSection('featured-properties')} className="block text-left w-full text-gray-700 hover:text-primary-600">Projects</button>
            <div>
              <div className="block text-gray-700 font-medium mb-2">Services</div>
              <div className="pl-4">
                <Link href="/properties?serviceType=property" className="block text-gray-700 hover:text-primary-600 py-1">Property</Link>
                <Link href="/properties?serviceType=land" className="block text-gray-700 hover:text-primary-600 py-1">Land</Link>
              </div>
            </div>
            <button onClick={() => scrollToSection('team')} className="block text-left w-full text-gray-700 hover:text-primary-600">Team</button>
            <button onClick={() => scrollToSection('testimonials')} className="block text-left w-full text-gray-700 hover:text-primary-600">Testimonials</button>
            <Link href="/news" className="block text-gray-700 hover:text-primary-600">News</Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-900 transition-colors"
            >
              Request A Visit
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
