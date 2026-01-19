import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LucideHome, 
  Book, 
  Users, 
  Calendar, 
  MessageSquare, 
  BarChart, 
  Settings,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authorization Required</h1>
          <p className="mb-6">You need to login to access this page</p>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const navigation = (() => {
    if (user.role === 'admin') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: LucideHome },
        { name: 'Manage Users', href: '/dashboard/users', icon: Users },
        { name: 'Prayer Events', href: '/dashboard/events', icon: Calendar },
        { name: 'Prayer Requests', href: '/dashboard/requests', icon: MessageSquare },
        { name: 'Training Content', href: '/dashboard/training', icon: Book },
        { name: 'Reports', href: '/dashboard/reports', icon: BarChart },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ];
    }
    
    if (user.role === 'partner') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: LucideHome },
        { name: 'Impact Reports', href: '/dashboard/reports', icon: BarChart },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ];
    }
    
    if (user.role === 'regional_leader') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: LucideHome },
        { name: 'Training Progress', href: '/dashboard/training', icon: Book },
        { name: 'Manage Users', href: '/dashboard/users', icon: Users },
        { name: 'Prayer Events', href: '/dashboard/events', icon: Calendar },
        { name: 'Prayer Requests', href: '/dashboard/requests', icon: MessageSquare },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ];
    }
    
    // Default for watchman and other roles
    return [
      { name: 'Dashboard', href: '/dashboard', icon: LucideHome },
      { name: 'Training Progress', href: '/dashboard/training', icon: Book },
      { name: 'Prayer Events', href: '/dashboard/events', icon: Calendar },
      { name: 'Prayer Requests', href: '/dashboard/requests', icon: MessageSquare },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];
  })();
  
  const userInitials = (user.name || 'User')
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
    
  const roleLabel = {
    'admin': 'Administrator',
    'watchman': 'Prayer Watchman',
    'partner': 'Partner',
    'regional_leader': 'Regional Leader'
  }[user.role] || 'User';
  
  const Sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-primary-600">Prayer Watchman</span>
        </Link>
      </div>
      
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.name} 
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setOpen(false)}
              >
                <item.icon className={`mr-3 h-5 w-5 ${
                  isActive ? 'text-primary-500' : 'text-gray-400'
                }`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="px-3 py-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar>
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user.name || 'User'}</p>
              <p className="text-xs text-gray-500">{roleLabel}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              console.log('Logout button clicked');
              logout();
            }}
            title="Logout"
          >
            <LogOut className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="w-64 bg-white shadow-sm">
          {Sidebar}
        </div>
      </div>
      
      {/* Mobile sidebar */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute top-4 left-4 z-40"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            {Sidebar}
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm md:hidden">
          <div className="h-16 flex items-center justify-center relative">
            <Link to="/" className="text-xl font-bold text-primary-600">
              Prayer Watchman
            </Link>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
