import { useQuery } from '@tanstack/react-query';
import { useViewer } from '@/lib/viewer';
import { fetchDashboard } from './dashboardService';

export function useDashboardQuery() {
  const { viewer } = useViewer();
  return useQuery({ queryKey: ['dashboard', viewer.role], queryFn: () => fetchDashboard(viewer) });
}
