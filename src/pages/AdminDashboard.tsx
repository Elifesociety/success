import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../components/AdminNav';
import RegistrationsTable from '../components/RegistrationsTable';
import PanchayathManager from '../components/PanchayathManager';
import AdminRoleTable from '../components/AdminRoleTable';
import CategoryManager from '../components/CategoryManager';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [panchayathStats, setPanchayathStats] = useState<any[]>([]);
  const navigate = useNavigate();
  const { stats, isLoading } = useDashboardStats();

  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    if (!user) {
      navigate('/admin/login');
      return;
    }
    setCurrentUser(JSON.parse(user));
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchPanchayathStats();
    }
  }, [activeTab]);

  const fetchPanchayathStats = async () => {
    try {
      const { data: panchayaths } = await supabase
        .from('panchayaths')
        .select('name');

      const { data: registrations } = await supabase
        .from('registrations')
        .select('panchayath');

      if (panchayaths && registrations) {
        const statsMap = panchayaths.map(p => ({
          name: p.name,
          count: registrations.filter(r => r.panchayath === p.name).length
        }));
        setPanchayathStats(statsMap);
      }
    } catch (error) {
      console.error('Error fetching panchayath stats:', error);
    }
  };

  if (!currentUser) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? 'Loading...' : stats.totalRegistrations}
                  </div>
                  <p className="text-xs text-muted-foreground">All time registrations</p>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-sm text-gray-500">Loading categories...</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(stats.categoryCounts).map(([category, count]) => (
                        <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-xs font-medium">{category}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                      {Object.keys(stats.categoryCounts).length === 0 && (
                        <div className="col-span-2 text-sm text-gray-500">No registrations yet</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Panchayath-wise Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {panchayathStats.map((stat, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <h3 className="font-semibold">{stat.name}</h3>
                        <p className="text-2xl font-bold text-blue-600">{stat.count}</p>
                        <p className="text-sm text-gray-500">registrations</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'registrations':
        return <RegistrationsTable userRole={currentUser.role} />;
      case 'panchayath':
        return <PanchayathManager userRole={currentUser.role} />;
      case 'categories':
        return <CategoryManager userRole={currentUser.role} />;
      case 'admins':
        return <AdminRoleTable userRole={currentUser.role} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav 
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'registrations' && 'Registrations Management'}
            {activeTab === 'panchayath' && 'Panchayath Management'}
            {activeTab === 'categories' && 'Category Fee & Image Management'}
            {activeTab === 'admins' && 'Admin Role Management'}
          </h1>
          <p className="text-gray-600">
            Welcome back, {currentUser.role}
          </p>
        </div>
        
        {renderTabContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;