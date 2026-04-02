'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Bot, 
  Database, 
  Workflow, 
  Settings,
  Languages,
  PhoneCall
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Smart Assistants', href: '/agents', icon: Bot },
  { name: 'Calling Agent', href: '/calling-agent', icon: PhoneCall },
  { name: 'Business Records', href: '/memory', icon: Database },
  { name: 'Automated Tasks', href: '/workflows', icon: Workflow },
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState('en');

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-slate-300">
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <span className="text-xl font-bold text-white tracking-tight">AutoPilotX</span>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-4 py-4">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400',
                    'mr-3 h-5 w-5 flex-shrink-0 transition-colors'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-slate-800 p-4 space-y-4">
        <div className="px-3">
          <label htmlFor="language" className="sr-only">Language</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Languages className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </div>
            <select
              id="language"
              name="language"
              className="block w-full rounded-md border-0 bg-slate-800 py-1.5 pl-10 pr-8 text-sm text-slate-300 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 appearance-none"
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-1">
          <Link
            href="/settings"
            className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Settings className="mr-3 h-5 w-5 text-slate-400 group-hover:text-indigo-400" />
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
