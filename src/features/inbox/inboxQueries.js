import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useViewer } from '@/lib/viewer';
import { fetchThreads, markThreadRead, sendMessage, simulateReply } from './inboxService';

export function useThreadsQuery() {
  const { viewer } = useViewer();
  return useQuery({ queryKey: ['inbox', viewer.role], queryFn: () => fetchThreads(viewer) });
}

export function useMarkThreadRead() {
  const { viewer } = useViewer();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => markThreadRead(viewer, id),
    onSuccess: () => Promise.all(['inbox', 'dashboard'].map((key) => queryClient.invalidateQueries({ queryKey: [key] }))),
  });
}

export function useSendMessage() {
  const { viewer } = useViewer();
  const queryClient = useQueryClient();
  const refresh = () =>
    Promise.all(['inbox', 'dashboard'].map((key) => queryClient.invalidateQueries({ queryKey: [key] })));
  return useMutation({
    mutationFn: ({ id, text }) => sendMessage(viewer, id, text),
    onSuccess: async (_thread, { id }) => {
      await refresh();
      if (viewer.role === 'admin') {
        setTimeout(() => simulateReply(id).then(refresh), 2200);
      }
    },
  });
}
