import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Home } from 'lucide-react';

interface AdminNavProps {
  currentUser: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminNav = ({ currentUser, activeTab, setActiveTab }: AdminNavProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', accessible: true },
    { id: 'registrations', label: 'Registrations', accessible: true },
    { id: 'panchayath', label: 'Panchayath', accessible: currentUser.role !== 'User Admin' },
    { id: 'categories', label: 'Category Fee & Image', accessible: currentUser.role !== 'User Admin' },
    { id: 'admins', label: 'Admin Roles', accessible: currentUser.role === 'Super Admin' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Button>
              </Link>
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
                <Badge variant="outline" className="ml-2">
                  {currentUser.role}
                </Badge>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-4">
              {navItems
                .filter(item => item.accessible)
                .map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    onClick={() => setActiveTab(item.id)}
                    className="text-sm"
                  >
                    {item.label}
                  </Button>
                ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {currentUser.username}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-2 overflow-x-auto">
            {navItems
              .filter(item => item.accessible)
              .map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(item.id)}
                  className="text-sm whitespace-nowrap"
                  size="sm"
                >
                  {item.label}
                </Button>
              ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;