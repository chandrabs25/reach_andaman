'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, User, Search, ShoppingCart } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Packages', href: '/packages' },
    { name: 'Activities', href: '/activities' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Reach Andaman
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-gray-600 hover:text-blue-600 ${
                  pathname === link.href ? 'font-semibold text-blue-600' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-600 hover:text-blue-600">
              <Search size={20} />
            </button>
            
            {isLoading ? (
              <div className="h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.role === 'vendor' && (
                  <Link href="/vendor/dashboard" className="text-gray-600 hover:text-blue-600">
                    Vendor Dashboard
                  </Link>
                )}
                <Link href="/bookings" className="text-gray-600 hover:text-blue-600">
                  <ShoppingCart size={20} />
                </Link>
                <Link 
                  href="/profile" 
                  className="flex items-center text-gray-600 hover:text-blue-600"
                >
                  <User size={20} className="mr-1" />
                  <span>{user?.name || 'Profile'}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/auth/signup" 
                  className="text-blue-600 hover:text-blue-800 px-4 py-2"
                >
                  Sign Up
                </Link>
                <Link 
                  href="/auth/signin" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-600">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-gray-600 hover:text-blue-600 ${
                    pathname === link.href ? 'font-semibold text-blue-600' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    {user?.role === 'vendor' && (
                      <Link 
                        href="/vendor/dashboard" 
                        className="block py-2 text-gray-600 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Vendor Dashboard
                      </Link>
                    )}
                    <Link 
                      href="/bookings" 
                      className="block py-2 text-gray-600 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link 
                      href="/profile" 
                      className="block py-2 text-gray-600 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/auth/signup" 
                      className="block py-2 text-blue-600 font-semibold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                    <Link 
                      href="/auth/signin" 
                      className="block py-2 text-blue-600 font-semibold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
