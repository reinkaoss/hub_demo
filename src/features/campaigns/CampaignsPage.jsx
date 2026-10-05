import { Link } from 'react-router-dom';
import { Megaphone, Percent, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { formatGBP } from '@/lib/money';
import { useViewer } from '@/lib/viewer';
import { useCampaignsQuery } from './campaignsQueries';

export default function CampaignsPage() {
  const { isAdmin } = useViewer();
  const { data: campaigns = [], isLoading } = useCampaignsQuery();

  return (
    <div>
      <PageHeader
        eyebrow="Campaigns"
        title={isAdmin ? 'Campaigns' : 'My campaigns'}
        description="Open a campaign for its team, shared resources and social gallery."
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" className="text-slate-300" />
        </div>
      ) : campaigns.length === 0 ? (
        <EmptyState icon={Megaphone} title="No campaigns yet" description="You have not been assigned to a campaign." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {campaigns.map((campaign) => {
            const percent = Math.min(100, Math.round((campaign.signups / campaign.target) * 100));
            return (
              <Link key={campaign.code} to={`/campaigns/${campaign.code}`} className="group block">
                <Card className="overflow-hidden transition group-hover:-translate-y-0.5 group-hover:shadow-md">
                  <div
                    className="flex h-24 items-end justify-between p-4 text-white"
                    style={{
                      background: `linear-gradient(135deg, hsl(${campaign.hue} 70% 38%), hsl(${(campaign.hue + 40) % 360} 70% 28%))`,
                    }}
                  >
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-white/70">
                        {campaign.client}
                      </p>
                      <h2 className="text-lg font-bold leading-tight">{campaign.name}</h2>
                    </div>
                    <span className="rounded-md bg-white/20 px-2 py-1 font-mono text-[0.7rem] font-semibold">
                      {campaign.code}
                    </span>
                  </div>
                  <div className="space-y-3 p-4">
                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-600">Sign-up target</span>
                        <span className="tabular-nums text-slate-500">
                          {campaign.signups} / {campaign.target}
                        </span>
                      </div>
                      <Progress value={percent} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Users className="size-3.5" /> {campaign.ambassadorCount} ambassadors
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Percent className="size-3.5" /> {percent}% of target
                      </span>
                      <span className="ml-auto font-medium text-slate-700">{formatGBP(campaign.payRate)}/hr</span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
