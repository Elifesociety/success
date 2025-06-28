import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import CategoryCard from '../components/CategoryCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const defaultCategories = [
  {
    id: 'pennyekart-free',
    name: 'Pennyekart Free Registration',
    description: 'Totally free registration with basic level access. Free delivery between 2pm to 6pm.',
    actualFee: 0,
    offerFee: 0,
    features: [
      'Free registration',
      'Free delivery (2pm-6pm)',
      'Basic level access',
      'E-commerce platform access'
    ]
  },
  {
    id: 'pennyekart-paid',
    name: 'Pennyekart Paid Registration',
    description: 'Premium registration with extended delivery hours and enhanced features.',
    actualFee: 500,
    offerFee: 299,
    features: [
      'Any time delivery (8am-7pm)',
      'Premium features',
      'Priority support',
      'Extended service hours'
    ]
  },
  {
    id: 'farmelife',
    name: 'Farmelife',
    description: 'Connected with dairy farm, poultry farm and agricultural businesses.',
    actualFee: 800,
    offerFee: 599,
    features: [
      'Dairy farm connections',
      'Poultry farm network',
      'Agricultural business support',
      'Farm-to-market solutions'
    ]
  },
  {
    id: 'organelife',
    name: 'Organelife',
    description: 'Connected with vegetable and house gardening, especially terrace vegetable farming.',
    actualFee: 600,
    offerFee: 399,
    features: [
      'Organic farming support',
      'Terrace gardening solutions',
      'Vegetable farming network',
      'Sustainable agriculture'
    ]
  },
  {
    id: 'foodelif',
    name: 'Foodelif',
    description: 'Connected with food processing business and culinary services.',
    actualFee: 700,
    offerFee: 499,
    features: [
      'Food processing business',
      'Culinary services',
      'Recipe sharing platform',
      'Food quality certification'
    ]
  },
  {
    id: 'entrelife',
    name: 'Entrelife',
    description: 'Connected with skilled projects like stitching, art works, and various home services.',
    actualFee: 650,
    offerFee: 449,
    features: [
      'Skilled project management',
      'Stitching and tailoring',
      'Art and craft services',
      'Home service network'
    ]
  },
  {
    id: 'job-card',
    name: 'Job Card',
    description: 'Special offer card with access to all categories, special discounts, and investment opportunities.',
    actualFee: 2000,
    offerFee: 999,
    features: [
      'Access to all categories',
      'Special fee cut packages',
      'Exclusive offers and discounts',
      'Investment card benefits',
      'Convertible to any category',
      'Points and profit system'
    ]
  }
];

const Categories = () => {
  const [categories, setCategories] = useState(defaultCategories);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) {
        console.log('Using default categories');
      } else if (data && data.length > 0) {
        setCategories(data);
      }
    } catch (error) {
      console.log('Using default categories');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Our Categories
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Explore our comprehensive range of self-employment categories designed to empower your entrepreneurial journey.
            </p>
            <Link to="/registration">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start Registration
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onSelect={() => {}}
                isSelected={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;