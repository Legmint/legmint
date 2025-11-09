'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo size={32} />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname === '/'
                  ? 'text-mint-400 border-b-2 border-mint-400 pb-1'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Templates
            </Link>
            <Link
              href="/lawyers"
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname === '/lawyers'
                  ? 'text-mint-400 border-b-2 border-mint-400 pb-1'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Find Lawyers
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname === '/about'
                  ? 'text-mint-400 border-b-2 border-mint-400 pb-1'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              About
            </Link>
            <Link
              href="/blog"
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname?.startsWith('/blog')
                  ? 'text-mint-400 border-b-2 border-mint-400 pb-1'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Blog
            </Link>
            <Link
              href="/help"
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname === '/help'
                  ? 'text-mint-400 border-b-2 border-mint-400 pb-1'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Help
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center space-x-4">
            <button className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200">
              Sign In
            </button>
            <button className="bg-mint-400 text-navy-500 hover:bg-mint-300 px-6 py-2 rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}