
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RegistrationsTableProps {
  userRole: string;
}

interface Registration {
  id: string;
  name: string;
  category: string;
  mobile: string;
  panchayath: string;
  address: string;
  ward: string;
  created_at: string;
}

const RegistrationsTable = ({ userRole }: RegistrationsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const canEdit = userRole !== 'User Admin';

  useEffect(() => {
    fetchRegistrations();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('registrations-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'registrations' },
        () => {
          fetchRegistrations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching registrations:', error);
        toast({
          title: "Error",
          description: "Failed to load registrations.",
          variant: "destructive"
        });
      } else {
        setRegistrations(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // Mock export - will implement with actual XLSX library
    toast({
      title: "Export Started",
      description: "Your data is being exported to XLSX format.",
    });
  };

  const handleDelete = async (id: string) => {
    if (!canEdit) return;
    
    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting registration:', error);
        toast({
          title: "Error",
          description: "Failed to delete registration.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Registration Deleted",
          description: "The registration has been removed successfully.",
        });
        fetchRegistrations();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredData = registrations.filter(reg => {
    const matchesSearch = reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.mobile.includes(searchTerm) ||
                         reg.panchayath.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || reg.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registrations Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading registrations...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrations Management</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Input
            placeholder="Search by name, mobile, or panchayath..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Pennyekart Free Registration">Pennyekart Free</SelectItem>
              <SelectItem value="Pennyekart Paid Registration">Pennyekart Paid</SelectItem>
              <SelectItem value="Farmelife">Farmelife</SelectItem>
              <SelectItem value="Organelife">Organelife</SelectItem>
              <SelectItem value="Foodelif">Foodelif</SelectItem>
              <SelectItem value="Entrelife">Entrelife</SelectItem>
              <SelectItem value="Job Card">Job Card</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} variant="outline">
            Export XLSX
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Category</th>
                <th className="text-left p-2">Mobile</th>
                <th className="text-left p-2">Panchayath</th>
                <th className="text-left p-2">Ward</th>
                <th className="text-left p-2">Date</th>
                {canEdit && <th className="text-left p-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((registration) => (
                <tr key={registration.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{registration.name}</td>
                  <td className="p-2">
                    <Badge variant="secondary">{registration.category}</Badge>
                  </td>
                  <td className="p-2">{registration.mobile}</td>
                  <td className="p-2">{registration.panchayath}</td>
                  <td className="p-2">{registration.ward}</td>
                  <td className="p-2">{new Date(registration.created_at).toLocaleDateString()}</td>
                  {canEdit && (
                    <td className="p-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(registration.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No registrations found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RegistrationsTable;
