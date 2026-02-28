'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  Home,
  Briefcase,
  Calendar,
  Star,
  ChevronDown,
  Search,
  MapPin,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { colors } from '@/lib/colors';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Mumbai');
  const [notifications, setNotifications] = useState(0);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Don't show navbar on auth pages and admin pages
  const hideNavbar = pathname?.startsWith('/auth') || pathname?.startsWith('/admin');

  // Popular cities for location selector
  const popularCities = [
    'Mumbai', 'Delhi', 'badlapur'
  ];

  // Popular services for search suggestions
  const popularServices = [
    'House Cleaning', 'Deep Cleaning', 'Kitchen Cleaning', 'Bathroom Cleaning',
    'Daily Cooking', 'Party Cooking', 'Meal Prep', 'Child Care', 'Baby Sitting',
    'Elder Care', 'Laundry Service', 'Ironing', 'Carpet Cleaning', 'Sofa Cleaning'
  ];

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotificationCount();
    }
  }, [session]);

  const fetchNotificationCount = async () => {
    try {
      const response = await fetch('/api/user/notifications', {
        headers: {
          'user-id': session!.user.id,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const unreadCount = data.notifications?.filter((n: any) => !n.isRead).length || 0;
        setNotifications(unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/services?search=${encodeURIComponent(query.trim())}&location=${encodeURIComponent(selectedLocation)}`);
      setSearchQuery('');
      setIsSearchFocused(false);
    }
  };

  const handleLocationChange = (city: string) => {
    setSelectedLocation(city);
    setIsLocationOpen(false);
  };

  const filteredServices = popularServices.filter(service =>
    service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/services', label: 'Services', icon: Briefcase },
    { href: '/service-provider/register', label: 'Become a Provider', icon: Star },
  ];

  if (hideNavbar) return null;

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50" style={{ borderColor: colors.border.light }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={() => router.push('/')}
              className="text-xl font-bold transition-colors"
              style={{ 
                color: colors.text.primary,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.text.secondary}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.text.primary}
            >
              MaidEase
            </button>
          </div>

          {/* Search Bar and Location Selector - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-2xl mx-8">
            {/* Location Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center space-x-2 px-4 py-2 border-r transition-colors"
                style={{ 
                  borderColor: colors.border.light,
                  color: colors.text.primary,
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.background.secondary}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">{selectedLocation}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Location Dropdown */}
              {isLocationOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg border z-50" style={{ borderColor: colors.border.light }}>
                  <div className="p-2">
                    <div className="text-xs font-medium mb-2 px-2" style={{ color: colors.text.secondary }}>
                      Popular Cities
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {popularCities.map((city) => (
                        <button
                          key={city}
                          onClick={() => handleLocationChange(city)}
                          className={`text-left px-2 py-1 rounded text-sm transition-colors ${
                            selectedLocation === city ? 'font-medium' : ''
                          }`}
                          style={{
                            color: selectedLocation === city ? colors.text.primary : colors.text.secondary,
                            backgroundColor: selectedLocation === city ? colors.background.secondary : 'transparent',
                          }}
                          onMouseEnter={(e) => {
                            if (selectedLocation !== city) {
                              e.currentTarget.style.backgroundColor = colors.background.secondary;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedLocation !== city) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="relative border rounded-md" style={{ borderColor: colors.border.light }}>
                <input
                  type="text"
                  placeholder="Search for services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchQuery);
                    }
                  }}
                  className="w-full px-4 py-2 pr-10 border-0 focus:outline-none text-sm rounded-md"
                  style={{ 
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                  }}
                />
                <button
                  onClick={() => handleSearch(searchQuery)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
                  style={{ color: colors.text.secondary }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.text.primary}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.text.secondary}
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Search Suggestions */}
              {isSearchFocused && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border z-50" style={{ borderColor: colors.border.light }}>
                  <div className="p-2">
                    {filteredServices.length > 0 ? (
                      <>
                        <div className="text-xs font-medium mb-2 px-2" style={{ color: colors.text.secondary }}>
                          Popular Services
                        </div>
                        {filteredServices.slice(0, 6).map((service) => (
                          <button
                            key={service}
                            onClick={() => handleSearch(service)}
                            className="flex items-center w-full px-2 py-2 text-left text-sm rounded transition-colors"
                            style={{ color: colors.text.secondary }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = colors.background.secondary;
                              e.currentTarget.style.color = colors.text.primary;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = colors.text.secondary;
                            }}
                          >
                            <Search className="w-3 h-3 mr-2" />
                            {service}
                          </button>
                        ))}
                      </>
                    ) : (
                      <div className="px-2 py-4 text-center text-sm" style={{ color: colors.text.secondary }}>
                        No services found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar for Medium Screens */}
          <div className="hidden md:flex lg:hidden items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchQuery);
                  }
                }}
                className="w-full px-4 py-2 pr-10 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ 
                  borderColor: colors.border.light,
                  backgroundColor: colors.background.primary,
                  color: colors.text.primary,
                }}
              />
              <button
                onClick={() => handleSearch(searchQuery)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
                style={{ color: colors.text.secondary }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors.text.primary}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.text.secondary}
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                  style={{
                    color: isActive ? colors.text.primary : colors.text.secondary,
                    backgroundColor: isActive ? colors.background.secondary : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = colors.text.primary;
                      e.currentTarget.style.backgroundColor = colors.background.secondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = colors.text.secondary;
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <>
                {/* Notifications */}
                <button
                  onClick={() => router.push('/profile?tab=notifications')}
                  className="relative p-2 rounded-full transition-colors"
                  style={{ color: colors.text.secondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.text.primary;
                    e.currentTarget.style.backgroundColor = colors.background.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.text.secondary;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center p-0"
                    >
                      {notifications > 9 ? '9+' : notifications}
                    </Badge>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-md transition-colors"
                    style={{ color: colors.text.secondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = colors.text.primary;
                      e.currentTarget.style.backgroundColor = colors.background.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = colors.text.secondary;
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: colors.background.secondary }}>
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <span className="hidden sm:block text-sm font-medium">
                      {session.user.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50" style={{ borderColor: colors.border.light }}>
                      <div className="py-1">
                        <div className="px-4 py-2 border-b" style={{ borderColor: colors.border.light }}>
                          <p className="text-sm font-medium" style={{ color: colors.text.primary }}>
                            {session.user.name}
                          </p>
                          <p className="text-sm" style={{ color: colors.text.secondary }}>
                            {session.user.email}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => {
                            router.push('/dashboard');
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm transition-colors"
                          style={{ color: colors.text.secondary }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = colors.text.primary;
                            e.currentTarget.style.backgroundColor = colors.background.secondary;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = colors.text.secondary;
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Calendar className="w-4 h-4 mr-3" />
                          Dashboard
                        </button>
                        
                        <button
                          onClick={() => {
                            router.push('/profile');
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm transition-colors"
                          style={{ color: colors.text.secondary }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = colors.text.primary;
                            e.currentTarget.style.backgroundColor = colors.background.secondary;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = colors.text.secondary;
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Profile Settings
                        </button>
                        
                        <button
                          onClick={() => {
                            router.push('/service-provider');
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm transition-colors"
                          style={{ color: colors.text.secondary }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = colors.text.primary;
                            e.currentTarget.style.backgroundColor = colors.background.secondary;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = colors.text.secondary;
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Briefcase className="w-4 h-4 mr-3" />
                          Provider Dashboard
                        </button>
                        
                        <div className="border-t" style={{ borderColor: colors.border.light }}>
                          <button
                            onClick={handleSignOut}
                            className="flex items-center w-full px-4 py-2 text-sm transition-colors"
                            style={{ color: colors.error[600] }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = colors.error[50];
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/auth/login')}
                  style={{ 
                    color: colors.text.primary,
                    backgroundColor: 'transparent',
                  }}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push('/auth/register')}
                  style={{ 
                    backgroundColor: colors.primary[950],
                    color: colors.text.inverse,
                    borderColor: colors.primary[950],
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2">
              {/* Quick Search Button for Mobile */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden p-2 rounded-md transition-colors"
                style={{ color: colors.text.secondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.text.primary;
                  e.currentTarget.style.backgroundColor = colors.background.secondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text.secondary;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Search className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md transition-colors"
                style={{ color: colors.text.secondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.text.primary;
                  e.currentTarget.style.backgroundColor = colors.background.secondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text.secondary;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white" style={{ borderColor: colors.border.light }}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search for services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch(searchQuery);
                          setIsMenuOpen(false);
                        }
                      }}
                      className="w-full px-3 py-2 pr-8 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ 
                        borderColor: colors.border.light,
                        backgroundColor: colors.background.primary,
                        color: colors.text.primary,
                      }}
                    />
                    <button
                      onClick={() => {
                        handleSearch(searchQuery);
                        setIsMenuOpen(false);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                      style={{ color: colors.text.secondary }}
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Mobile Location Selector */}
                <button
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 border rounded-md text-sm"
                  style={{ 
                    borderColor: colors.border.light,
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedLocation}</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isLocationOpen && (
                  <div className="mt-2 p-2 border rounded-md" style={{ borderColor: colors.border.light, backgroundColor: colors.background.secondary }}>
                    <div className="grid grid-cols-2 gap-1">
                      {popularCities.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            handleLocationChange(city);
                            setIsMenuOpen(false);
                          }}
                          className={`text-left px-2 py-1 rounded text-sm transition-colors ${
                            selectedLocation === city ? 'font-medium' : ''
                          }`}
                          style={{
                            color: selectedLocation === city ? colors.text.primary : colors.text.secondary,
                            backgroundColor: selectedLocation === city ? colors.background.primary : 'transparent',
                          }}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Navigation Links */}
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <button
                    key={link.href}
                    onClick={() => {
                      router.push(link.href);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors"
                    style={{
                      color: isActive ? colors.text.primary : colors.text.secondary,
                      backgroundColor: isActive ? colors.background.secondary : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = colors.text.primary;
                        e.currentTarget.style.backgroundColor = colors.background.secondary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = colors.text.secondary;
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
              
              {session && (
                <>
                  <div className="border-t pt-3 mt-3" style={{ borderColor: colors.border.light }}>
                    <button
                      onClick={() => {
                        router.push('/dashboard');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors"
                      style={{ color: colors.text.secondary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = colors.text.primary;
                        e.currentTarget.style.backgroundColor = colors.background.secondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = colors.text.secondary;
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Calendar className="w-5 h-5" />
                      <span>Dashboard</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        router.push('/profile');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors"
                      style={{ color: colors.text.secondary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = colors.text.primary;
                        e.currentTarget.style.backgroundColor = colors.background.secondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = colors.text.secondary;
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Settings className="w-5 h-5" />
                      <span>Profile</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(isProfileOpen || isMenuOpen || isLocationOpen || isSearchFocused) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false);
            setIsMenuOpen(false);
            setIsLocationOpen(false);
            setIsSearchFocused(false);
          }}
        />
      )}
    </nav>
  );
}