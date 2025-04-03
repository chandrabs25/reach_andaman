'use client';

import Image from 'next/image';

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-blue-900 h-64 md:h-80">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700">
          <Image 
            src="/images/about-hero.jpg" 
            alt="About Andaman Explorer" 
            fill 
            className="object-cover mix-blend-overlay"
            priority
          />
        </div>
        
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            About Andaman Explorer
          </h1>
          <p className="text-xl text-white text-center max-w-2xl">
            Your trusted partner for unforgettable Andaman experiences
          </p>
        </div>
      </div>
      
      {/* About Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p>
                Founded in 2018, Andaman Explorer was born out of a passion for the breathtaking beauty of the Andaman Islands and a desire to share this hidden paradise with travelers from around the world. What began as a small team of local guides has grown into a comprehensive travel platform dedicated to providing authentic and memorable experiences.
              </p>
              <p>
                Our journey started when our founder, a native Andamanese, recognized the need for a reliable travel service that could showcase the islands' natural wonders while respecting their delicate ecosystems and supporting local communities. Today, we continue to uphold these values as we help travelers discover the magic of the Andamans.
              </p>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <div className="prose prose-lg max-w-none">
              <p>
                At Andaman Explorer, our mission is to provide exceptional travel experiences that connect visitors with the natural beauty, rich culture, and warm hospitality of the Andaman Islands. We are committed to:
              </p>
              <ul>
                <li>Promoting sustainable tourism that preserves the islands' pristine environments</li>
                <li>Supporting local communities through responsible travel practices</li>
                <li>Offering personalized services that cater to each traveler's unique preferences</li>
                <li>Ensuring safety, comfort, and satisfaction throughout your journey</li>
                <li>Creating unforgettable memories that last a lifetime</li>
              </ul>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Local Expertise</h3>
                <p className="text-gray-700">
                  Our team consists of local experts with deep knowledge of the islands, ensuring authentic experiences and insider access.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Personalized Service</h3>
                <p className="text-gray-700">
                  We tailor each itinerary to match your interests, preferences, and travel style for a truly customized experience.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Sustainable Practices</h3>
                <p className="text-gray-700">
                  We're committed to eco-friendly tourism that preserves the natural beauty of the Andaman Islands for generations to come.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image 
                    src="/images/team-1.jpg" 
                    alt="Team Member" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Rajiv Sharma</h3>
                <p className="text-gray-600">Founder & CEO</p>
              </div>
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image 
                    src="/images/team-2.jpg" 
                    alt="Team Member" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Priya Patel</h3>
                <p className="text-gray-600">Head of Operations</p>
              </div>
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image 
                    src="/images/team-3.jpg" 
                    alt="Team Member" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Arun Kumar</h3>
                <p className="text-gray-600">Lead Tour Guide</p>
              </div>
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image 
                    src="/images/team-4.jpg" 
                    alt="Team Member" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Maya Reddy</h3>
                <p className="text-gray-600">Customer Relations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
