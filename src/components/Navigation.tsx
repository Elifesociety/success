import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Home, Info, Grid3X3, Search, Shield } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About Project', icon: Info },
    { path: '/categories', label: 'Categories', icon: Grid3X3 },
    { path: '/check-status', label: 'Check Status', icon: Search },
    { path: '/admin/login', label: 'Admin', icon: Shield }
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ES</span>
            </div>
            <span className="font-bold text-xl text-gray-900">E-Life Society</span>
          </Link>
          
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
          
          {/* Mobile menu */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <Grid3X3 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;