import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useViewer } from '@/lib/viewer';
import { fetchAmbassadors, setSuspended } from './ambassadorsService';

export function useAmbassadorsQuery(filters) {
  const { viewer } = useViewer();
  return useQuery({
    queryKey: ['ambassadors', viewer.role, filters],
    queryFn: () => fetchAmbassadors(viewer, filters),
    placeholderData: keepPreviousData,
    enabled: viewer.role === 'admin',
  });
}

export function useSetSuspended() {
  const { viewer } = useViewer();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, suspended }) => setSuspended(viewer, id, suspended),
    onSuccess: () =>
      Promise.all(
        ['ambassadors', 'dashboard', 'campaign'].map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
      ),
  });
}
