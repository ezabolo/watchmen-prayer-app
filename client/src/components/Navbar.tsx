import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import watchmanLogo from "@assets/Watchman_Logo2_1753398543943.png";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const isHomePage = location === '/';



  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Watchmen", href: "/watchman" },
    { name: "Partners", href: "/partner" },
    { name: "Prayer Space", href: "/prayer-space" },
    { name: "Training", href: "/training" },
    { name: "Books", href: "/books" },
  ];
  
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
    : '';
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      (isHomePage && !isScrolled) 
        ? 'bg-transparent' 
        : 'bg-white shadow-sm'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src={watchmanLogo} 
                  alt="Prayer Watchman Logo" 
                  className="h-16 w-16 rounded-full object-cover"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium uppercase tracking-wide transition-colors duration-300 ${
                      isActive
                        ? `border-primary-500 ${(isHomePage && !isScrolled) ? 'text-white' : 'text-gray-900'}`
                        : `border-transparent ${(isHomePage && !isScrolled) ? 'text-white/80 hover:text-white' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <Button asChild variant="ghost" className={`transition-colors duration-300 uppercase tracking-wide ${
                  (isHomePage && !isScrolled) ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-gray-900'
                }`}>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                

                
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" size="sm" onClick={logout} className={`transition-colors duration-300 ${
                    (isHomePage && !isScrolled) ? 'text-white hover:text-white/80' : 'text-gray-700 hover:text-gray-900'
                  }`}>
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button asChild className={`px-4 py-2 text-white font-medium uppercase tracking-wide transition-all duration-300 ${
                  (isHomePage && !isScrolled) 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}>
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold uppercase tracking-wide transition-all duration-300">
                  <Link to="/donate">Donate</Link>
                </Button>
              </div>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-300 ${
                    (isHomePage && !isScrolled) 
                      ? 'text-white hover:text-white/80 hover:bg-white/10'
                      : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
                  }`}
                  aria-label="Open main menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md pt-6">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium uppercase tracking-wide ${
                          isActive
                            ? "bg-primary-50 border-primary-500 text-primary-700"
                            : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                        }`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                        }}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                  {user ? (
                    <div className="flex flex-col px-4 space-y-3">
                      <div className="flex items-center">
                        <Avatar>
                          <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-700">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button asChild className="w-full uppercase tracking-wide">
                          <Link
                            to="/dashboard"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                            }}
                          >
                            Dashboard
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full uppercase tracking-wide"
                          onClick={() => {
                            logout();
                            setMobileMenuOpen(false);
                          }}
                        >
                          Sign out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col px-4 space-y-3">
                      <Button asChild className="w-full uppercase tracking-wide">
                        <Link
                          to="/login"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                          }}
                        >
                          Sign in
                        </Link>
                      </Button>
                      <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                        <Link
                          to="/donate"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                          }}
                        >
                          Donate
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
