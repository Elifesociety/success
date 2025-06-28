
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalRegistrations: number;
  categoryCounts: Record<string, number>;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRegistrations: 0,
    categoryCounts: {}
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Set up real-time subscription for live stats
    const channel = supabase
      .channel('stats-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'registrations' },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('category');

      if (error) {
        console.error('Error fetching stats:', error);
      } else {
        const totalRegistrations = data?.length || 0;
        const categoryCounts: Record<string, number> = {};
        
        data?.forEach(registration => {
          const category = registration.category;
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        setStats({
          totalRegistrations,
          categoryCounts
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { stats, isLoading };
};
