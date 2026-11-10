import { useState } from 'react';
import { FolderX, Heart, MessageCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/EmptyState';
import { cn } from '@/lib/utils';
import { useFoldersQuery, useResourcesQuery } from './campaignsQueries';
import { MediaViewer } from './MediaViewer';
import { ResourceThumb } from './ResourceThumb';

export function ResourcesTab({ code }) {
  const [folderId, setFolderId] = useState('all');
  const [viewerIndex, setViewerIndex] = useState(null);
  const { data: folders = [] } = useFoldersQuery(code);
  const { data: resources = [], isLoading } = useResourcesQuery(code);

  const visible = folderId === 'all' ? resources : resources.filter((r) => r.folderId === folderId);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[{ id: 'all', name: 'All files' }, ...folders].map((folder) => (
          <button
            key={folder.id}
            type="button"
            onClick={() => setFolderId(folder.id)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition',
              folderId === folder.id
                ? 'border-signal bg-signal text-white'
                : 'border-border bg-card text-muted-foreground hover:bg-white/5',
            )}
          >
            {folder.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" className="text-muted-foreground" />
        </div>
      ) : visible.length === 0 ? (
        <EmptyState icon={FolderX} title="No files in this folder" />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((resource, index) => (
            <div
              key={resource.id}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-white/20"
            >
              <button
                type="button"
                aria-label={`Open ${resource.title}`}
                onClick={() => setViewerIndex(index)}
                className="block aspect-square w-full overflow-hidden"
              >
                <ResourceThumb resource={resource} />
              </button>
              <div className="p-2.5">
                <p className="mb-2 truncate text-xs font-medium text-foreground/90">{resource.title}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="size-3.5" /> {resource.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="size-3.5" /> {resource.comments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <MediaViewer
        items={visible}
        index={viewerIndex}
        onIndexChange={setViewerIndex}
        onClose={() => setViewerIndex(null)}
      />
    </div>
  );
}
