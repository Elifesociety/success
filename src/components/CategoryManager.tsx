import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Trash2, Plus } from 'lucide-react';

interface CategoryManagerProps {
  userRole: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  actual_fee: number;
  offer_fee: number;
  image: string;
  features: string[];
  is_active: boolean;
}

const CategoryManager = ({ userRole }: CategoryManagerProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    description: '',
    actual_fee: 0,
    offer_fee: 0,
    image: '',
    features: [],
    is_active: true
  });

  const canEdit = userRole !== 'User Admin';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: "Failed to load categories.",
          variant: "destructive"
        });
      } else {
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingCategory || !canEdit) return;

    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: editingCategory.name,
          description: editingCategory.description,
          actual_fee: editingCategory.actual_fee,
          offer_fee: editingCategory.offer_fee,
          image: editingCategory.image,
          features: editingCategory.features,
          is_active: editingCategory.is_active
        })
        .eq('id', editingCategory.id);

      if (error) {
        console.error('Error updating category:', error);
        toast({
          title: "Error",
          description: "Failed to update category.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Category updated successfully!",
        });
        setShowEditDialog(false);
        setEditingCategory(null);
        fetchCategories();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAdd = async () => {
    if (!canEdit) return;

    if (!newCategory.name || !newCategory.description) {
      toast({
        title: "Error",
        description: "Please fill required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const categoryId = newCategory.name?.toLowerCase().replace(/\s+/g, '-') || '';
      
      const { error } = await supabase
        .from('categories')
        .insert([{
          id: categoryId,
          ...newCategory
        }]);

      if (error) {
        console.error('Error adding category:', error);
        toast({
          title: "Error",
          description: "Failed to add category.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Category added successfully!",
        });
        setShowAddDialog(false);
        setNewCategory({
          name: '',
          description: '',
          actual_fee: 0,
          offer_fee: 0,
          image: '',
          features: [],
          is_active: true
        });
        fetchCategories();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!canEdit) return;
    
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting category:', error);
        toast({
          title: "Error",
          description: "Failed to delete category.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Category deleted successfully!",
        });
        fetchCategories();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    if (!canEdit) return;
    
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) {
        console.error('Error updating category status:', error);
        toast({
          title: "Error",
          description: "Failed to update category status.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: `Category ${!currentStatus ? 'activated' : 'deactivated'} successfully!`,
        });
        fetchCategories();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!canEdit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Fee & Image Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            You don't have permission to manage categories.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Fee & Image Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading categories...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Category Fee & Image Management</CardTitle>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Actual Fee</th>
                  <th className="text-left p-3">Offer Fee</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.description}</div>
                      </div>
                    </td>
                    <td className="p-3">₹{category.actual_fee}</td>
                    <td className="p-3">₹{category.offer_fee}</td>
                    <td className="p-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(category.id, category.is_active)}
                        className={category.is_active ? 'text-green-600' : 'text-red-600'}
                      >
                        {category.is_active ? 'Active' : 'Inactive'}
                      </Button>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
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

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Category Name</Label>
                <Input
                  id="edit-name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    name: e.target.value
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    description: e.target.value
                  })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-actual-fee">Actual Fee</Label>
                  <Input
                    id="edit-actual-fee"
                    type="number"
                    value={editingCategory.actual_fee}
                    onChange={(e) => setEditingCategory({
                      ...editingCategory,
                      actual_fee: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-offer-fee">Offer Fee</Label>
                  <Input
                    id="edit-offer-fee"
                    type="number"
                    value={editingCategory.offer_fee}
                    onChange={(e) => setEditingCategory({
                      ...editingCategory,
                      offer_fee: Number(e.target.value)
                    })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  value={editingCategory.image || ''}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    image: e.target.value
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-features">Features (comma separated)</Label>
                <Textarea
                  id="edit-features"
                  value={editingCategory.features?.join(', ') || ''}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    features: e.target.value.split(',').map(f => f.trim()).filter(f => f)
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

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="add-name">Category Name</Label>
              <Input
                id="add-name"
                value={newCategory.name || ''}
                onChange={(e) => setNewCategory({
                  ...newCategory,
                  name: e.target.value
                })}
              />
            </div>
            
            <div>
              <Label htmlFor="add-description">Description</Label>
              <Textarea
                id="add-description"
                value={newCategory.description || ''}
                onChange={(e) => setNewCategory({
                  ...newCategory,
                  description: e.target.value
                })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-actual-fee">Actual Fee</Label>
                <Input
                  id="add-actual-fee"
                  type="number"
                  value={newCategory.actual_fee || 0}
                  onChange={(e) => setNewCategory({
                    ...newCategory,
                    actual_fee: Number(e.target.value)
                  })}
                />
              </div>
              <div>
                <Label htmlFor="add-offer-fee">Offer Fee</Label>
                <Input
                  id="add-offer-fee"
                  type="number"
                  value={newCategory.offer_fee || 0}
                  onChange={(e) => setNewCategory({
                    ...newCategory,
                    offer_fee: Number(e.target.value)
                  })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="add-image">Image URL</Label>
              <Input
                id="add-image"
                value={newCategory.image || ''}
                onChange={(e) => setNewCategory({
                  ...newCategory,
                  image: e.target.value
                })}
              />
            </div>
            
            <div>
              <Label htmlFor="add-features">Features (comma separated)</Label>
              <Textarea
                id="add-features"
                value={newCategory.features?.join(', ') || ''}
                onChange={(e) => setNewCategory({
                  ...newCategory,
                  features: e.target.value.split(',').map(f => f.trim()).filter(f => f)
                })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryManager;