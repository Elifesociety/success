import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string;
    actualFee: number;
    offerFee: number;
    image?: string;
    features: string[];
  };
  onSelect: (category: any) => void;
  isSelected: boolean;
}

const CategoryCard = ({ category, onSelect, isSelected }: CategoryCardProps) => {
  const discount = category.actualFee > 0 ? Math.round(((category.actualFee - category.offerFee) / category.actualFee) * 100) : 0;

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
          {discount > 0 && (
            <Badge variant="destructive" className="bg-red-500">
              {discount}% OFF
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">{category.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {category.image && (
          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <img 
              src={category.image} 
              alt={category.name}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Features:</h4>
          <ul className="text-xs space-y-1">
            {category.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Fee:</span>
            <div className="text-right">
              {category.actualFee > category.offerFee && (
                <span className="text-xs text-gray-500 line-through">₹{category.actualFee}</span>
              )}
              <span className="text-lg font-bold text-green-600 ml-1">
                {category.offerFee === 0 ? 'FREE' : `₹${category.offerFee}`}
              </span>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => onSelect(category)}
          className={`w-full ${isSelected ? 'bg-blue-600' : 'bg-gray-600'} hover:bg-blue-700`}
        >
          {isSelected ? 'Selected' : 'Select Category'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;