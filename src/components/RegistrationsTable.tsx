import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { Edit, Check, X, Trash2 } from 'lucide-react';

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
  customer_id: string;
  status: string;
  fee_amount: number;
  agent_details: string;
  created_at: string;
}

const RegistrationsTable = ({ userRole }: RegistrationsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPanchayath, setFilterPanchayath] = useState('all');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [panchayaths, setPanchayaths] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const canEdit = userRole !== 'User Admin';

  useEffect(() => {
    fetchRegistrations();
    fetchPanchayaths();
    
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
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data?.map(reg => reg.category) || [])];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPanchayaths = async () => {
    try {
      const { data, error } = await supabase
        .from('panchayaths')
        .select('name')
        .order('name');

      if (error) {
        console.error('Error fetching panchayaths:', error);
      } else {
        const panchayathNames = data?.map(p => p.name) || [];
        setPanchayaths(panchayathNames);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleExport = () => {
    try {
      const exportData = filteredData.map(reg => ({
        'Customer ID': reg.customer_id,
        'Name': reg.name,
        'Category': reg.category,
        'Mobile': reg.mobile,
        'Panchayath': reg.panchayath,
        'Ward': reg.ward,
        'Address': reg.address,
        'Agent Details': reg.agent_details || '',
        'Status': reg.status,
        'Fee Amount': reg.fee_amount,
        'Registration Date': new Date(reg.created_at).toLocaleDateString()
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
      XLSX.writeFile(wb, `registrations_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast({
        title: "Export Successful",
        description: "Registration data has been exported to Excel file.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    if (!canEdit) return;
    
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.error('Error updating status:', error);
        toast({
          title: "Error",
          description: "Failed to update status.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Status Updated",
          description: `Registration ${newStatus} successfully.`,
        });
        fetchRegistrations();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (registration: Registration) => {
    setEditingRegistration(registration);
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingRegistration || !canEdit) return;

    try {
      const { error } = await supabase
        .from('registrations')
        .update({
          category: editingRegistration.category,
          name: editingRegistration.name,
          mobile: editingRegistration.mobile,
          panchayath: editingRegistration.panchayath,
          ward: editingRegistration.ward,
          address: editingRegistration.address,
          agent_details: editingRegistration.agent_details
        })
        .eq('id', editingRegistration.id);

      if (error) {
        console.error('Error updating registration:', error);
        toast({
          title: "Error",
          description: "Failed to update registration.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Registration Updated",
          description: "Registration details have been updated successfully.",
        });
        setShowEditDialog(false);
        setEditingRegistration(null);
        fetchRegistrations();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!canEdit) return;
    
    if (!confirm('Are you sure you want to delete this registration?')) return;
    
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredData = registrations.filter(reg => {
    const matchesSearch = reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.mobile.includes(searchTerm) ||
                         reg.customer_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.panchayath.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || reg.category === filterCategory;
    const matchesPanchayath = filterPanchayath === 'all' || reg.panchayath === filterPanchayath;
    return matchesSearch && matchesCategory && matchesPanchayath;
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
    <>
      <Card>
        <CardHeader>
          <CardTitle>Registrations Management</CardTitle>
          <div className="flex flex-col lg:flex-row gap-4 mt-4">
            <Input
              placeholder="Search by name, mobile, customer ID, or panchayath..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPanchayath} onValueChange={setFilterPanchayath}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by panchayath" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Panchayaths</SelectItem>
                {panchayaths.map((panchayath) => (
                  <SelectItem key={panchayath} value={panchayath}>
                    {panchayath}
                  </SelectItem>
                ))}
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
                  <th className="text-left p-2">Customer ID</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Mobile</th>
                  <th className="text-left p-2">Panchayath</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Fee</th>
                  <th className="text-left p-2">Date</th>
                  {canEdit && <th className="text-left p-2">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((registration) => (
                  <tr key={registration.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-mono text-sm">{registration.customer_id}</td>
                    <td className="p-2 font-medium">{registration.name}</td>
                    <td className="p-2">
                      <Badge variant="secondary">{registration.category}</Badge>
                    </td>
                    <td className="p-2">{registration.mobile}</td>
                    <td className="p-2">{registration.panchayath}</td>
                    <td className="p-2">
                      <Badge className={`${getStatusColor(registration.status)} text-white`}>
                        {registration.status?.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-2">₹{registration.fee_amount || 0}</td>
                    <td className="p-2">{new Date(registration.created_at).toLocaleDateString()}</td>
                    {canEdit && (
                      <td className="p-2">
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(registration)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          {registration.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(registration.id, 'approved')}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(registration.id, 'rejected')}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(registration.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
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

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Registration</DialogTitle>
          </DialogHeader>
          {editingRegistration && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingRegistration.name}
                    onChange={(e) => setEditingRegistration({
                      ...editingRegistration,
                      name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-mobile">Mobile</Label>
                  <Input
                    id="edit-mobile"
                    value={editingRegistration.mobile}
                    onChange={(e) => setEditingRegistration({
                      ...editingRegistration,
                      mobile: e.target.value
                    })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select 
                  value={editingRegistration.category} 
                  onValueChange={(value) => setEditingRegistration({
                    ...editingRegistration,
                    category: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
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
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-panchayath">Panchayath</Label>
                  <Select 
                    value={editingRegistration.panchayath} 
                    onValueChange={(value) => setEditingRegistration({
                      ...editingRegistration,
                      panchayath: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {panchayaths.map((panchayath) => (
                        <SelectItem key={panchayath} value={panchayath}>
                          {panchayath}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-ward">Ward</Label>
                  <Input
                    id="edit-ward"
                    value={editingRegistration.ward}
                    onChange={(e) => setEditingRegistration({
                      ...editingRegistration,
                      ward: e.target.value
                    })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={editingRegistration.address}
                  onChange={(e) => setEditingRegistration({
                    ...editingRegistration,
                    address: e.target.value
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-agent">Agent Details</Label>
                <Input
                  id="edit-agent"
                  value={editingRegistration.agent_details || ''}
                  onChange={(e) => setEditingRegistration({
                    ...editingRegistration,
                    agent_details: e.target.value
                  })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegistrationsTable;