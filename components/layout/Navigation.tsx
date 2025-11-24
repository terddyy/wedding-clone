
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/home', label: 'Home' },
    { href: '/home#countdown', label: 'Countdown' },
    { href: '/home#details', label: 'Details' },
    { href: '/home#our-journey', label: 'Photos' },
    { href: '/rsvp', label: 'RSVP' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/home" className="text-2xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8b7355' }}>
              JHE & EIFER
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navItems.map((item) => {
                const hrefBase = item.href.split('#')[0];
                const isActive = pathname === hrefBase;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100"
                    style={{
                      color: '#2c2c2c',
                      backgroundColor: isActive ? '#f5e6d3' : 'transparent'
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
