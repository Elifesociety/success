
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const categories = [
  'Pennyekart Free Registration',
  'Pennyekart Paid Registration',
  'Farmelife',
  'Organelife',
  'Foodelif',
  'Entrelife',
  'Job Card'
];

const Registration = () => {
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    address: '',
    mobile: '',
    panchayath: '',
    ward: ''
  });
  const [panchayaths, setPanchayaths] = useState<Array<{id: string, name: string, district: string}>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPanchayaths();
  }, []);

  const fetchPanchayaths = async () => {
    try {
      const { data, error } = await supabase
        .from('panchayaths')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching panchayaths:', error);
        toast({
          title: "Error",
          description: "Failed to load panchayaths. Please refresh the page.",
          variant: "destructive"
        });
      } else {
        setPanchayaths(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.category || !formData.name || !formData.address || !formData.mobile || !formData.panchayath || !formData.ward) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('registrations')
        .insert([formData]);

      if (error) {
        console.error('Error submitting registration:', error);
        toast({
          title: "Error",
          description: "Failed to submit registration. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success!",
          description: "Your registration has been submitted successfully.",
        });
        
        // Reset form
        setFormData({
          category: '',
          name: '',
          address: '',
          mobile: '',
          panchayath: '',
          ward: ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="text-2xl font-bold text-center">
              Self Employment Registration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="category">Select Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Enter your complete address"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  placeholder="Enter your mobile number"
                />
              </div>

              <div>
                <Label htmlFor="panchayath">Panchayath *</Label>
                <Select value={formData.panchayath} onValueChange={(value) => setFormData({...formData, panchayath: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your Panchayath" />
                  </SelectTrigger>
                  <SelectContent>
                    {panchayaths.map((panchayath) => (
                      <SelectItem key={panchayath.id} value={panchayath.name}>
                        {panchayath.name} - {panchayath.district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ward">Ward *</Label>
                <Input
                  id="ward"
                  value={formData.ward}
                  onChange={(e) => setFormData({...formData, ward: e.target.value})}
                  placeholder="Enter your ward"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Registration;
