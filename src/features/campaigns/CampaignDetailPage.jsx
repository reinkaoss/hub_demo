import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Target, Wallet } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { formatGBP } from '@/lib/money';
import { useCampaignQuery } from './campaignsQueries';
import { ResourcesTab } from './ResourcesTab';
import { SocialTab } from './SocialTab';

const initials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

function Stat({ icon: Icon, label, children }) {
  return (
    <Card className="flex items-start gap-3 p-4">
      <div className="flex size-9 items-center justify-center rounded-xl bg-signal/10 text-signal">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        {children}
      </div>
    </Card>
  );
}

export default function CampaignDetailPage() {
  const { code } = useParams();
  const { data: campaign, isLoading } = useCampaignQuery(code);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" className="text-slate-300" />
      </div>
    );
  }
  if (!campaign) {
    return (
      <div>
        <EmptyState title="Campaign not found" description="It may not exist, or you may not be assigned to it." />
        <div className="mt-4 text-center">
          <Link to="/campaigns" className="text-sm font-medium text-signal hover:underline">
            Back to campaigns
          </Link>
        </div>
      </div>
    );
  }

  const percent = Math.min(100, Math.round((campaign.signups / campaign.target) * 100));

  return (
    <div>
      <Link
        to="/campaigns"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="size-4" /> Campaigns
      </Link>

      <div
        className="mb-6 flex flex-wrap items-end justify-between gap-3 rounded-2xl p-6 text-white"
        style={{
          background: `linear-gradient(135deg, hsl(${campaign.hue} 70% 36%), hsl(${(campaign.hue + 40) % 360} 70% 26%))`,
        }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">{campaign.client}</p>
          <h1 className="text-2xl font-bold">{campaign.name}</h1>
        </div>
        <span className="rounded-md bg-white/20 px-2.5 py-1 font-mono text-xs font-semibold">{campaign.code}</span>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-5 pt-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat icon={Target} label="Sign-ups">
              <p className="text-lg font-bold tabular-nums text-slate-900">
                {campaign.signups} <span className="text-sm font-medium text-slate-400">/ {campaign.target}</span>
              </p>
              <Progress value={percent} className="mt-2" />
            </Stat>
            <Stat icon={Clock} label="Approved hours">
              <p className="text-lg font-bold tabular-nums text-slate-900">{campaign.approvedHours}</p>
            </Stat>
            <Stat icon={Wallet} label="Pay rate">
              <p className="text-lg font-bold tabular-nums text-slate-900">{formatGBP(campaign.payRate)}/hr</p>
            </Stat>
          </div>

          <Card className="p-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-800">Team ({campaign.team.length})</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {campaign.team.map((member) => (
                <li key={member.id} className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback>{initials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{member.name}</p>
                    <p className="truncate text-xs text-slate-500">{member.university}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="pt-4">
          <ResourcesTab code={code} />
        </TabsContent>

        <TabsContent value="social" className="pt-4">
          <SocialTab code={code} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
