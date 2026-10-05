import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useViewer } from '@/lib/viewer';
import { fetchExpenses, fetchPaidExportGroups, setExpenseStatus, updateExpenseAmount } from './expensesService';

export function useExpensesQuery(filters) {
  const { viewer } = useViewer();
  return useQuery({
    queryKey: ['expenses', viewer.role, filters],
    queryFn: () => fetchExpenses(viewer, filters),
    placeholderData: keepPreviousData,
  });
}

function useRefresh() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all(['expenses', 'dashboard'].map((key) => queryClient.invalidateQueries({ queryKey: [key] })));
}

export function useSetExpenseStatus() {
  const { viewer } = useViewer();
  const refresh = useRefresh();
  return useMutation({
    mutationFn: ({ id, status, reason }) => setExpenseStatus(viewer, id, status, { reason }),
    onSuccess: refresh,
  });
}

export function useUpdateExpenseAmount() {
  const { viewer } = useViewer();
  const refresh = useRefresh();
  return useMutation({ mutationFn: ({ id, amount }) => updateExpenseAmount(viewer, id, amount), onSuccess: refresh });
}

export function useExportPaid() {
  const { viewer } = useViewer();
  return useMutation({ mutationFn: () => fetchPaidExportGroups(viewer) });
}
