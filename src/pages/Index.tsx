
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { UserPlus, Shield, Users, MapPin } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Self Employment
              <span className="text-blue-600"> Registration</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A comprehensive platform for managing self-employment registrations with advanced admin controls and real-time data management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/registration">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Start Registration
                </Button>
              </Link>
              <Link to="/admin/login">
                <Button size="lg" variant="outline" className="px-8 py-3">
                  Admin Login
                </Button>
              </Link>
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
              'Pennyekart Free Registration',
              'Pennyekart Paid Registration', 
              'Farmelife',
              'Organelife',
              'Foodelif',
              'Entrelife',
              'Job Card'
            ].map((category, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
                  <p className="text-sm text-gray-600">
                    {category === 'Job Card' ? 'Special Category' : 'Self Employment Category'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Self Employment Registration Portal</h3>
            <p className="text-gray-400 mb-8">
              Empowering communities through organized self-employment registration and management.
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
