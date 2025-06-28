import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const StatusChecker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'mobile' | 'customer_id'>('mobile');
  const [registration, setRegistration] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a mobile number or customer ID",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq(searchType, searchQuery)
        .single();

      if (error || !data) {
        toast({
          title: "Not Found",
          description: "No registration found with the provided details",
          variant: "destructive"
        });
        setRegistration(null);
      } else {
        setRegistration(data);
      }
    } catch (error) {
      console.error('Error searching registration:', error);
      toast({
        title: "Error",
        description: "Failed to search registration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Check Registration Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button
              variant={searchType === 'mobile' ? 'default' : 'outline'}
              onClick={() => setSearchType('mobile')}
              size="sm"
            >
              Mobile Number
            </Button>
            <Button
              variant={searchType === 'customer_id' ? 'default' : 'outline'}
              onClick={() => setSearchType('customer_id')}
              size="sm"
            >
              Customer ID
            </Button>
          </div>
          
          <div>
            <Label htmlFor="search">
              {searchType === 'mobile' ? 'Mobile Number' : 'Customer ID'}
            </Label>
            <Input
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchType === 'mobile' ? 'Enter mobile number' : 'Enter customer ID'}
            />
          </div>
          
          <Button onClick={handleSearch} disabled={isLoading} className="w-full">
            {isLoading ? 'Searching...' : 'Check Status'}
          </Button>
        </CardContent>
      </Card>

      {registration && (
        <Card>
          <CardHeader>
            <CardTitle>Registration Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Customer ID</Label>
                <p className="font-mono text-lg">{registration.customer_id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Badge className={`${getStatusColor(registration.status)} text-white`}>
                  {registration.status?.toUpperCase()}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p>{registration.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <p>{registration.category}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Mobile</Label>
                <p>{registration.mobile}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Panchayath</Label>
                <p>{registration.panchayath}</p>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Registration Date</Label>
              <p>{new Date(registration.created_at).toLocaleDateString()}</p>
            </div>
            
            {registration.status === 'pending' && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  Your registration is pending approval. Please wait for payment approval confirmation.
                </p>
              </div>
            )}
            
            {registration.status === 'approved' && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 text-sm">
                  Congratulations! Your registration has been approved.
                </p>
              </div>
            )}
            
            {registration.status === 'rejected' && (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-800 text-sm">
                  Your registration has been rejected. Please contact support for more information.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatusChecker;