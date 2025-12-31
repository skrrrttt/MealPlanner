'use client';

import { Home, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Planner', icon: Home },
    { href: '/grocery', label: 'Grocery', icon: ShoppingCart },
  ];

  return (
    <nav className="safe-bottom border-t border-ios-gray-2 bg-white">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors no-select ios-button-press ${
                isActive ? 'text-ios-blue' : 'text-ios-gray-5'
              }`}
            >
              <Icon size={24} strokeWidth={2} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
