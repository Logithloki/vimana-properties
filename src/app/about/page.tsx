'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      image: '/images/team-1.jpg',
      bio: 'With over 15 years in real estate, John leads our company with expertise and vision.',
    },
    {
      name: 'Sarah Johnson',
      role: 'Head of Sales',
      image: '/images/team-2.jpg',
      bio: 'Sarah brings 10 years of experience and has closed over $50 million in property sales.',
    },
    {
      name: 'Michael Chen',
      role: 'Senior Agent',
      image: '/images/team-3.jpg',
      bio: 'Michael specializes in luxury properties and has an exceptional eye for property value.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Director',
      image: '/images/team-4.jpg',
      bio: 'Emily leads our marketing efforts, ensuring your property reaches the right audience.',
    },
  ];

  const [isVisible, setIsVisible] = useState({
    companyOverview: false,
    missionValues: false,
    ourTeam: false,
    achievements: false,
    contactDetails: false
  });

  const companyOverviewRef = useRef<HTMLDivElement>(null);
  const missionValuesRef = useRef<HTMLDivElement>(null);
  const ourTeamRef = useRef<HTMLDivElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);
  const contactDetailsRef = useRef<HTMLDivElement>(null);

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

    const sections = [companyOverviewRef, missionValuesRef, ourTeamRef, achievementsRef, contactDetailsRef];
    sections.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="pt-12 pb-16 font-inter">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 py-16 mb-12 shadow-lg">
        {/* Animated Background Element - House Icon */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div 
            className="absolute top-1/4 left-1/4 w-32 h-32 text-white opacity-80 animate-float1"
            style={{
              animationDuration: '15s'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm0 2.06l7 6.41V20h-4v-6H9v6H5V11.47l7-6.41z"/>
            </svg>
          </div>
           <div 
            className="absolute bottom-1/4 right-1/4 w-40 h-40 text-white opacity-60 animate-float2"
            style={{
              animationDuration: '20s',
               animationDelay: '2s'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm0 2.06l7 6.41V20h-4v-6H9v6H5V11.47l7-6.41z"/>
            </svg>
          </div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
          <p className="text-primary-100 text-xl">Vimana Properties — where tradition meets opportunity.</p>
        </div>
      </div>

      {/* Company Overview */}
      <div 
        ref={companyOverviewRef}
        data-section="companyOverview"
        className={`container mx-auto px-4 mb-16 transition-all duration-1000 ${
          isVisible.companyOverview ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600 mb-6">
              Based in the heart of Sri Lanka's cultural capital, we bring more than just property
              expertise — we bring passion, insight, and a commitment to your vision.
            </p>
            <p className="text-gray-600 mb-6">
              Whether you're looking for your dream home, a smart investment, or the perfect commercial
              space, our portfolio is built on elegance, functionality, and long-term value.
            </p>
            <p className="text-gray-600">
              We Are Simply What You Haven't Imagined Yet.
            </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/images/about-company.jpg"
              alt="Our Company"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mission & Values */}
      <div 
        ref={missionValuesRef}
        data-section="missionValues"
        className={`bg-gray-50 py-16 mb-16 transition-all duration-1000 ${
          isVisible.missionValues ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to delivering exceptional property solutions with professionalism and integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary-100 p-3 rounded-full inline-block mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Real Estate Services</h3>
              <p className="text-gray-600">
                We deliver premium property solutions tailored to meet your unique needs and expectations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary-100 p-3 rounded-full inline-block mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Satisfaction Guarantee</h3>
              <p className="text-gray-600">
                Your complete satisfaction is our priority, and we stand behind our commitment to excellence.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary-100 p-3 rounded-full inline-block mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Highly Professional Team</h3>
              <p className="text-gray-600">
                Our experienced professionals are dedicated to providing expert guidance and personalized service.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary-100 p-3 rounded-full inline-block mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Dealing Always On Time</h3>
              <p className="text-gray-600">
                We respect your time and ensure punctual, efficient service throughout every transaction.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div 
        ref={ourTeamRef}
        data-section="ourTeam"
        className={`container mx-auto px-4 mb-16 transition-all duration-1000 ${
          isVisible.ourTeam ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our team of experienced professionals is dedicated to helping you achieve your real estate goals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-64">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-primary-600 text-sm mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div 
        ref={achievementsRef}
        data-section="achievements"
        className={`bg-gray-50 py-16 mb-16 transition-all duration-1000 ${
          isVisible.achievements ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Achievements</h2>            
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're proud of our track record and the trust our clients place in us.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <p className="text-gray-600">Properties Sold</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-primary-600 mb-2">98%</div>
              <p className="text-gray-600">Client Satisfaction</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-primary-600 mb-2">15+</div>
              <p className="text-gray-600">Years of Experience</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-primary-600 mb-2">20+</div>
              <p className="text-gray-600">Industry Awards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div 
        ref={contactDetailsRef}
        data-section="contactDetails"
        className={`container mx-auto px-4 mb-16 transition-all duration-1000 ${
          isVisible.contactDetails ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8 text-lg">
                We Are Simply What You Haven't Imagined Yet.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-gray-600">123 Property Lane, Colombo, Sri Lanka</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-600">info@vimanaproperties.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-gray-600">+94 11 123 4567</p>
                  </div>
                </div>
              </div>
              
              <Link 
                href="/contact" 
                className="inline-block mt-8 px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-300"
              >
                Contact Us
              </Link>
            </div>
            
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-md">
              <Image
                src="/images/contact-image.jpg"
                alt="Contact Us"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}