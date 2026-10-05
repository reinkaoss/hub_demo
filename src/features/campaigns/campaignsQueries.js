import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useViewer } from '@/lib/viewer';
import {
  fetchCampaign,
  fetchCampaigns,
  fetchFolders,
  fetchResources,
  fetchSocialPosts,
  setSocialPostHidden,
} from './campaignsService';

export function useCampaignsQuery() {
  const { viewer } = useViewer();
  return useQuery({ queryKey: ['campaigns', viewer.role], queryFn: () => fetchCampaigns(viewer) });
}

export function useCampaignQuery(code) {
  const { viewer } = useViewer();
  return useQuery({
    queryKey: ['campaign', viewer.role, code],
    queryFn: () => fetchCampaign(viewer, code),
    enabled: Boolean(code),
  });
}

export function useFoldersQuery(code) {
  const { viewer } = useViewer();
  return useQuery({
    queryKey: ['folders', viewer.role, code],
    queryFn: () => fetchFolders(viewer, code),
    enabled: Boolean(code),
  });
}

export function useResourcesQuery(code) {
  const { viewer } = useViewer();
  return useQuery({
    queryKey: ['resources', viewer.role, code],
    queryFn: () => fetchResources(viewer, code),
    enabled: Boolean(code),
    placeholderData: keepPreviousData,
  });
}

export function useSocialPostsQuery(code) {
  const { viewer } = useViewer();
  return useQuery({
    queryKey: ['social', viewer.role, code],
    queryFn: () => fetchSocialPosts(viewer, code),
    enabled: Boolean(code),
  });
}

export function useSetSocialPostHidden(code) {
  const { viewer } = useViewer();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, hidden }) => setSocialPostHidden(viewer, id, hidden),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['social', viewer.role, code] }),
  });
}
