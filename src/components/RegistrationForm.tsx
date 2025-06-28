import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RegistrationFormProps {
  selectedCategory: any;
  onBack: () => void;
}

const RegistrationForm = ({ selectedCategory, onBack }: RegistrationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobile: '',
    panchayath: '',
    ward: '',
    agentDetails: ''
  });
  const [panchayaths, setPanchayaths] = useState<Array<{id: string, name: string, district: string}>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [generatedId, setGeneratedId] = useState('');

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

  const generateCustomerId = (mobile: string, name: string) => {
    const firstLetter = name.charAt(0).toUpperCase();
    return `ESEP${mobile}${firstLetter}`;
  };

  const checkDuplicateRegistration = async (mobile: string) => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('id')
        .eq('mobile', mobile);

      if (error) {
        console.error('Error checking duplicate:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.address || !formData.mobile || !formData.panchayath || !formData.ward) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate registration
    const isDuplicate = await checkDuplicateRegistration(formData.mobile);
    if (isDuplicate) {
      toast({
        title: "Registration Already Exists",
        description: "A registration with this mobile number already exists.",
        variant: "destructive"
      });
      return;
    }

    setShowConfirmation(true);
  };

  const confirmSubmission = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);

    try {
      const customerId = generateCustomerId(formData.mobile, formData.name);
      
      const registrationData = {
        ...formData,
        category: selectedCategory.name,
        customer_id: customerId,
        status: 'pending',
        fee_amount: selectedCategory.offerFee
      };

      const { error } = await supabase
        .from('registrations')
        .insert([registrationData]);

      if (error) {
        console.error('Error submitting registration:', error);
        toast({
          title: "Error",
          description: "Failed to submit registration. Please try again.",
          variant: "destructive"
        });
      } else {
        setGeneratedId(customerId);
        setShowSuccessPopup(true);
        
        // Reset form
        setFormData({
          name: '',
          address: '',
          mobile: '',
          panchayath: '',
          ward: '',
          agentDetails: ''
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
    <>
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">
              Registration Form - {selectedCategory.name}
            </CardTitle>
            <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20">
              ← Back to Categories
            </Button>
          </div>
          <div className="text-sm opacity-90">
            Fee: {selectedCategory.offerFee === 0 ? 'FREE' : `₹${selectedCategory.offerFee}`}
            {selectedCategory.actualFee > selectedCategory.offerFee && (
              <span className="ml-2 line-through opacity-75">₹{selectedCategory.actualFee}</span>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your full name"
                required
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
                required
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
                pattern="[0-9]{10}"
                required
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
                required
              />
            </div>

            <div>
              <Label htmlFor="agentDetails">Agent/P.R.O Details</Label>
              <Textarea
                id="agentDetails"
                value={formData.agentDetails}
                onChange={(e) => setFormData({...formData, agentDetails: e.target.value})}
                placeholder="Enter agent or P.R.O details (optional)"
                rows={2}
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

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Registration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Registration Details</h3>
              <div className="mt-2 space-y-1 text-sm">
                <p><strong>Category:</strong> {selectedCategory.name}</p>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Mobile:</strong> {formData.mobile}</p>
                <p><strong>Panchayath:</strong> {formData.panchayath}</p>
                <p><strong>Fee:</strong> {selectedCategory.offerFee === 0 ? 'FREE' : `₹${selectedCategory.offerFee}`}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setShowConfirmation(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={confirmSubmission} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Confirm & Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Popup */}
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registration Successful!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            {selectedCategory.image && (
              <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                <img 
                  src={selectedCategory.image} 
                  alt={selectedCategory.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Your Customer ID</h3>
              <p className="text-2xl font-bold text-green-700 mt-2">{generatedId}</p>
              <p className="text-sm text-green-600 mt-1">Please save this ID for future reference</p>
            </div>
            <p className="text-sm text-gray-600">
              Your registration is pending approval. You will be notified once it's processed.
            </p>
            <Button onClick={() => {
              setShowSuccessPopup(false);
              onBack();
            }} className="w-full">
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegistrationForm;