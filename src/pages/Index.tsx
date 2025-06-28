import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { UserPlus, Shield, Users, MapPin, Search, Grid3X3 } from 'lucide-react';
import Navigation from '../components/Navigation';

const Index = () => {
  const features = [
    {
      icon: UserPlus,
      title: "Easy Registration",
      description: "Simple and intuitive registration form for self-employment categories"
    },
    {
      icon: Shield,
      title: "Secure Admin Panel",
      description: "Role-based access control with different permission levels"
    },
    {
      icon: Users,
      title: "Real-time Management",
      description: "Instant updates and data synchronization across all devices"
    },
    {
      icon: MapPin,
      title: "Location-based",
      description: "Dynamic Panchayath and District management system"
    }
  ];

  const quickActions = [
    {
      icon: UserPlus,
      title: "Register Now",
      description: "Start your self-employment journey",
      link: "/registration",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: Grid3X3,
      title: "View Categories",
      description: "Explore all available categories",
      link: "/categories",
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      icon: Search,
      title: "Check Status",
      description: "Track your registration status",
      link: "/check-status",
      color: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Self Employment
              <span className="text-blue-600"> Registration</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join E-Life Society's innovative hybrid e-commerce platform connecting self-employment opportunities with community services through Pennyekart.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} to={action.link}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardContent className="p-6 text-center">
                        <Icon className={`w-12 h-12 mx-auto mb-4 text-white p-2 rounded-lg ${action.color}`} />
                        <h3 className="font-semibold mb-2">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Platform Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm text-center">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Registration Categories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Pennyekart Free Registration', desc: 'Free registration with basic access' },
              { name: 'Pennyekart Paid Registration', desc: 'Premium features with extended hours' }, 
              { name: 'Farmelife', desc: 'Dairy and poultry farm connections' },
              { name: 'Organelife', desc: 'Organic farming and gardening' },
              { name: 'Foodelif', desc: 'Food processing and culinary services' },
              { name: 'Entrelife', desc: 'Skilled projects and home services' },
              { name: 'Job Card', desc: 'Premium card with all category access' }
            ].map((category, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/categories">
              <Button className="bg-blue-600 hover:bg-blue-700">
                View All Categories
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">E-Life Society Registration Portal</h3>
            <p className="text-gray-400 mb-8">
              Empowering communities through organized self-employment registration and innovative hybrid e-commerce solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/registration">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                  Register Now
                </Button>
              </Link>
              <Link to="/admin/login">
                <Button variant="ghost" className="text-white hover:bg-gray-800">
                  Admin Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;