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
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { colors, colorCombinations } from '@/lib/colors';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Don't show navbar on auth pages and admin pages
  const hideNavbar = pathname?.startsWith('/auth') || pathname?.startsWith('/admin');

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
          <div className="flex items-center">
            <button
              onClick={() => router.push('/')}
              className="text-2xl font-bold transition-colors"
              style={{ 
                color: colors.text.primary,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.text.secondary}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.text.primary}
            >
              Maids for care
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white" style={{ borderColor: colors.border.light }}>
            <div className="px-2 pt-2 pb-3 space-y-1">
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
      {(isProfileOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
}