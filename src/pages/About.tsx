import React from 'react';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About E-Life Society</h1>
            <p className="text-xl text-gray-600">
              Empowering communities through innovative self-employment solutions
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About Pennyekart - Hybrid E-commerce Platform</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Pennyekart is a revolutionary hybrid e-commerce platform that uniquely connects home delivery services 
                with self-employment programs through the "E-LIFE SOCIETY". This innovative approach makes it a truly 
                unique hybrid e-commerce solution.
              </p>
              <p className="text-gray-700">
                Our platform bridges the gap between traditional e-commerce and community-based self-employment, 
                creating opportunities for individuals while providing convenient services to customers.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Our Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold">Pennyekart Free Registration</h4>
                  <p className="text-sm text-gray-600">Totally free registration with basic level access</p>
                </div>
                <div>
                  <h4 className="font-semibold">Pennyekart Paid Registration</h4>
                  <p className="text-sm text-gray-600">Premium features with extended delivery hours</p>
                </div>
                <div>
                  <h4 className="font-semibold">Farmelife</h4>
                  <p className="text-sm text-gray-600">Connected with dairy farms, poultry farms, and agriculture</p>
                </div>
                <div>
                  <h4 className="font-semibold">Organelife</h4>
                  <p className="text-sm text-gray-600">Vegetable and house gardening, especially terrace farming</p>
                </div>
                <div>
                  <h4 className="font-semibold">Foodelif</h4>
                  <p className="text-sm text-gray-600">Food processing business and culinary services</p>
                </div>
                <div>
                  <h4 className="font-semibold">Entrelife</h4>
                  <p className="text-sm text-gray-600">Skilled projects like stitching, art works, home services</p>
                </div>
                <div>
                  <h4 className="font-semibold">Job Card</h4>
                  <p className="text-sm text-gray-600">Special offer card with access to all categories and investment benefits</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Why Choose E-Life Society?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  <p className="text-sm">Comprehensive self-employment opportunities</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  <p className="text-sm">Innovative hybrid e-commerce model</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  <p className="text-sm">Community-focused approach</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  <p className="text-sm">Multiple category options</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  <p className="text-sm">Investment and profit opportunities</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  <p className="text-sm">Special discounts and offers</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Job Card - The Ultimate Choice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The Job Card is our premium offering that provides access to all categories instead of separate 
                category registrations. It's the best choice for those who want maximum flexibility and benefits.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Key Features:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Special fee cut packages</li>
                    <li>• Exclusive offers and discounts</li>
                    <li>• Available only for first-time registrations</li>
                    <li>• Convertible to any category (not reversible)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Investment Benefits:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Investment card for getting points</li>
                    <li>• Profit sharing opportunities</li>
                    <li>• Long-term financial benefits</li>
                    <li>• Priority access to new features</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;