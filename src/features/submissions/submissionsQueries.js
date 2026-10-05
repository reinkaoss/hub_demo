import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useViewer } from '@/lib/viewer';
import { createSubmission, fetchSubmissions, setSubmissionStatus } from './submissionsService';

export function useSubmissionsQuery(filters) {
  const { viewer } = useViewer();
  return useQuery({
    queryKey: ['submissions', viewer.role, filters],
    queryFn: () => fetchSubmissions(viewer, filters),
    placeholderData: keepPreviousData,
  });
}

function useInvalidateAfterWrite() {
  const queryClient = useQueryClient();
  // Approving can publish a social post and moves dashboard totals, so refresh those too.
  return () =>
    Promise.all(
      ['submissions', 'dashboard', 'social'].map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
    );
}

export function useCreateSubmission() {
  const { viewer } = useViewer();
  const refresh = useInvalidateAfterWrite();
  return useMutation({ mutationFn: (input) => createSubmission(viewer, input), onSuccess: refresh });
}

export function useSetSubmissionStatus() {
  const { viewer } = useViewer();
  const refresh = useInvalidateAfterWrite();
  return useMutation({
    mutationFn: ({ id, status, reason }) => setSubmissionStatus(viewer, id, status, { reason }),
    onSuccess: refresh,
  });
}
