import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AdminRoleTableProps {
  userRole: string;
}

interface AdminUser {
  id: string;
  username: string;
  role: string;
  permissions: string;
  status: string;
  created_at: string;
}

const AdminRoleTable = ({ userRole }: AdminRoleTableProps) => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userRole === 'Super Admin') {
      fetchAdminUsers();
    } else {
      setIsLoading(false);
    }
  }, [userRole]);

  const fetchAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, username, role, permissions, status, created_at')
        .order('created_at');

      if (error) {
        console.error('Error fetching admin users:', error);
        toast({
          title: "Error",
          description: "Failed to load admin users.",
          variant: "destructive"
        });
      } else {
        setAdminUsers(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.error('Error updating admin status:', error);
        toast({
          title: "Error",
          description: "Failed to update admin status.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Status Updated",
          description: `Admin ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully.`,
        });
        fetchAdminUsers();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (userRole !== 'Super Admin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Role Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            You don't have permission to view admin roles.
            <br />
            Only Super Admin can access this section.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Role Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading admin users...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Role Management</CardTitle>
        <p className="text-sm text-gray-600">Manage administrator accounts and their permissions</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Username</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Permissions</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((admin) => (
                <tr key={admin.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{admin.username}</td>
                  <td className="p-3">
                    <Badge 
                      variant={admin.role === 'Super Admin' ? 'default' : 
                              admin.role === 'Local Admin' ? 'secondary' : 'outline'}
                    >
                      {admin.role}
                    </Badge>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{admin.permissions}</td>
                  <td className="p-3">
                    <Badge 
                      variant="outline" 
                      className={admin.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                    >
                      {admin.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="p-3">
                    {admin.role !== 'Super Admin' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusToggle(admin.id, admin.status)}
                        className={admin.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                      >
                        {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Role Permissions:</h4>
          <div className="text-xs space-y-1">
            <p><strong>Super Admin:</strong> Full access to all features including role management</p>
            <p><strong>Local Admin:</strong> Can view, add, edit, and delete registrations and panchayaths</p>
            <p><strong>User Admin:</strong> Read-only access to view registrations only</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRoleTable;