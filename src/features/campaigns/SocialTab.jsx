import { Eye, EyeOff, Heart, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/EmptyState';
import { PlatformChip, PROMOTION_LABELS } from '@/components/PromotionTypeBadge';
import { cn } from '@/lib/utils';
import { useViewer } from '@/lib/viewer';
import { useSetSocialPostHidden, useSocialPostsQuery } from './campaignsQueries';

export function SocialTab({ code }) {
  const { isAdmin } = useViewer();
  const { data: posts = [], isLoading } = useSocialPostsQuery(code);
  const setHidden = useSetSocialPostHidden(code);

  async function toggle(post) {
    try {
      await setHidden.mutateAsync({ id: post.id, hidden: !post.hidden });
      toast.success(post.hidden ? 'Post is visible to ambassadors again' : 'Post hidden from ambassadors');
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" className="text-slate-300" />
      </div>
    );
  }
  if (posts.length === 0) {
    return <EmptyState icon={Share2} title="No social posts yet" description="Approved timesheets with a link appear here." />;
  }

  return (
    <div className="space-y-3">
      {isAdmin ? (
        <p className="text-xs text-slate-500">
          As an admin you can hide a post from ambassadors without touching the timesheet behind it. Hidden posts stay
          visible to you, dimmed.
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={post.art}
                alt=""
                loading="lazy"
                className={cn('size-full object-cover transition', post.hidden && 'opacity-40 grayscale')}
              />
              <span className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-white/90 py-1 pl-1 pr-2.5 text-[0.65rem] font-semibold text-slate-700 shadow-sm">
                <PlatformChip type={post.platform} />
                {PROMOTION_LABELS[post.platform] ?? post.platform}
              </span>
              {post.hidden ? (
                <span className="absolute bottom-2 left-2 rounded-full bg-slate-900/80 px-2.5 py-1 text-[0.65rem] font-semibold text-white">
                  Hidden from ambassadors
                </span>
              ) : null}
              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => toggle(post)}
                  disabled={setHidden.isPending}
                  aria-label={post.hidden ? 'Show to ambassadors' : 'Hide from ambassadors'}
                  title={post.hidden ? 'Show to ambassadors' : 'Hide from ambassadors'}
                  className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white disabled:opacity-60"
                >
                  {post.hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              ) : null}
            </div>
            <div className="space-y-1 p-3">
              <p className="truncate text-xs font-semibold text-slate-800">{post.handle}</p>
              <p className="line-clamp-2 text-xs text-slate-500">{post.caption}</p>
              <p className="flex items-center gap-1 pt-1 text-xs text-slate-400">
                <Heart className="size-3.5" /> {post.likes.toLocaleString('en-GB')}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
