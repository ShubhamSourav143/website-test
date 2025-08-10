'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import SearchAndActions from './SearchAndActions'
import { supabase } from '@/lib/supabase'

const getPlaceholder = (pathname: string) => {
  if (pathname === '/adopt') return 'Search adoptable friends…'
  if (pathname === '/donate') return 'Search donation stories…'
  if (pathname === '/blog') return 'Search blog stories…'
  if (pathname === '/help') return 'Search for help topics…'
  return 'Search KGP Paws'
}

interface HeaderProps {
  onMenuClick: () => void
  sidebarOpen: boolean
}

export default function Header({ onMenuClick, sidebarOpen }: HeaderProps) {
  const pathname = usePathname()
  const [placeholder, setPlaceholder] = useState(getPlaceholder(pathname))
  const [isMobile, setIsMobile] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    setPlaceholder(getPlaceholder(pathname))
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [pathname])

  useEffect(() => {
    let unsub: (() => void) | undefined
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
    })
    unsub = () => sub.subscription.unsubscribe()
    return () => {
      try { unsub && unsub() } catch {}
    }
  }, [])

  const handleSearch = (query: string) => {
    // Implement search functionality
    console.log('Searching for:', query);
    // You can add search logic here
  };

  return (
    <header className={`fixed top-12 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-30 transition-all duration-300 animate-slideInDown ${
      !isMobile && sidebarOpen ? 'ml-80' : 'ml-0'
    }`}>
      <div className="flex items-center justify-between h-full px-6">
        
        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110 mr-4"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Search and Actions */}
        <div className="flex items-center gap-4 flex-1">
          <SearchAndActions 
            placeholder={placeholder}
            onSearch={handleSearch}
          />
          <div className="ml-auto">
            {userEmail ? (
              <div className="relative group">
                <button className="px-3 py-2 border rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50">
                  {userEmail}
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile/Settings</a>
                  <a href="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</a>
                </div>
              </div>
            ) : (
              <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Join</a>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}