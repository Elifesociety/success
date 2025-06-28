import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Trash2 } from 'lucide-react';

interface PanchayathManagerProps {
  userRole: string;
}

interface Panchayath {
  id: string;
  name: string;
  district: string;
}

const PanchayathManager = ({ userRole }: PanchayathManagerProps) => {
  const [newPanchayath, setNewPanchayath] = useState({ name: '', district: '' });
  const [panchayaths, setPanchayaths] = useState<Panchayath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPanchayath, setEditingPanchayath] = useState<Panchayath | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const canEdit = userRole !== 'User Admin';

  useEffect(() => {
    fetchPanchayaths();
    
    // Set up real-time subscription
    if (canEdit) {
      const channel = supabase
        .channel('panchayaths-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'panchayaths' },
          () => {
            fetchPanchayaths();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [canEdit]);

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
          description: "Failed to load panchayaths.",
          variant: "destructive"
        });
      } else {
        setPanchayaths(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!canEdit) return;
    
    if (!newPanchayath.name.trim() || !newPanchayath.district.trim()) {
      toast({
        title: "Error",
        description: "Please fill both name and district fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('panchayaths')
        .insert([{
          name: newPanchayath.name.trim(),
          district: newPanchayath.district.trim()
        }]);

      if (error) {
        console.error('Error adding panchayath:', error);
        toast({
          title: "Error",
          description: "Failed to add panchayath.",
          variant: "destructive"
        });
      } else {
        setNewPanchayath({ name: '', district: '' });
        toast({
          title: "Success",
          description: "Panchayath added successfully!",
        });
        fetchPanchayaths();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (panchayath: Panchayath) => {
    setEditingPanchayath(panchayath);
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingPanchayath || !canEdit) return;

    if (!editingPanchayath.name.trim() || !editingPanchayath.district.trim()) {
      toast({
        title: "Error",
        description: "Please fill both name and district fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('panchayaths')
        .update({
          name: editingPanchayath.name.trim(),
          district: editingPanchayath.district.trim()
        })
        .eq('id', editingPanchayath.id);

      if (error) {
        console.error('Error updating panchayath:', error);
        toast({
          title: "Error",
          description: "Failed to update panchayath.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Panchayath updated successfully!",
        });
        setShowEditDialog(false);
        setEditingPanchayath(null);
        fetchPanchayaths();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!canEdit) return;
    
    if (!confirm('Are you sure you want to delete this panchayath?')) return;
    
    try {
      const { error } = await supabase
        .from('panchayaths')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting panchayath:', error);
        toast({
          title: "Error",
          description: "Failed to delete panchayath.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Panchayath deleted successfully!",
        });
        fetchPanchayaths();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!canEdit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Panchayath Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            You don't have permission to manage Panchayaths.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Panchayath Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading panchayaths...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Panchayath</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="panchayath-name">Panchayath Name</Label>
                <Input
                  id="panchayath-name"
                  value={newPanchayath.name}
                  onChange={(e) => setNewPanchayath({...newPanchayath, name: e.target.value})}
                  placeholder="Enter Panchayath name"
                />
              </div>
              <div>
                <Label htmlFor="district-name">District</Label>
                <Input
                  id="district-name"
                  value={newPanchayath.district}
                  onChange={(e) => setNewPanchayath({...newPanchayath, district: e.target.value})}
                  placeholder="Enter District name"
                />
              </div>
            </div>
            <Button onClick={handleAdd} className="mt-4">
              Add Panchayath
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Panchayaths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Panchayath Name</th>
                    <th className="text-left p-2">District</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {panchayaths.map((panchayath) => (
                    <tr key={panchayath.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{panchayath.name}</td>
                      <td className="p-2">{panchayath.district}</td>
                      <td className="p-2">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(panchayath)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(panchayath.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Panchayath</DialogTitle>
          </DialogHeader>
          {editingPanchayath && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Panchayath Name</Label>
                <Input
                  id="edit-name"
                  value={editingPanchayath.name}
                  onChange={(e) => setEditingPanchayath({
                    ...editingPanchayath,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="edit-district">District</Label>
                <Input
                  id="edit-district"
                  value={editingPanchayath.district}
                  onChange={(e) => setEditingPanchayath({
                    ...editingPanchayath,
                    district: e.target.value
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

export default PanchayathManager;