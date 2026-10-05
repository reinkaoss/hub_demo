import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paperclip, Send, Users, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { PlatformChip, PROMOTION_LABELS, PROMOTION_TYPES } from '@/components/PromotionTypeBadge';
import { useViewer } from '@/lib/viewer';
import { useCampaignsQuery } from '@/features/campaigns/campaignsQueries';
import { REACH_GUIDANCE, fieldErrors, timesheetInputSchema } from './submissionRules';
import { useCreateSubmission } from './submissionsQueries';

const EMPTY = {
  campaignCode: '',
  promotionType: '',
  hours: '',
  reach: '',
  description: '',
  evidence: [],
  includeSocialLink: false,
  socialUrl: '',
};

function Field({ id, label, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint ? <p className="text-xs leading-relaxed text-slate-500">{hint}</p> : null}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}

export default function SubmissionFormPage() {
  const navigate = useNavigate();
  const { isAdmin, setRole } = useViewer();
  const { data: campaigns = [] } = useCampaignsQuery();
  const create = useCreateSubmission();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  if (isAdmin) {
    return (
      <div>
        <PageHeader eyebrow="Timesheets" title="Submit a timesheet" />
        <EmptyState
          icon={Users}
          title="Timesheets are submitted by ambassadors"
          description="You are viewing as an admin. Switch to the ambassador view to try the submission form."
        />
        <div className="mt-4 flex justify-center">
          <Button onClick={() => setRole('ambassador')}>View as ambassador</Button>
        </div>
      </div>
    );
  }

  const set = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
    // Clear the error for whatever the user is now editing.
    setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([key]) => !(key in patch))));
  };

  const addEvidence = (event) => {
    // Only the file NAME is kept: nothing is read or uploaded in this demo.
    const names = Array.from(event.target.files ?? []).map((file) => file.name);
    event.target.value = '';
    if (names.length) set({ evidence: [...form.evidence, ...names].slice(0, 10) });
  };

  async function onSubmit(event) {
    event.preventDefault();
    const result = timesheetInputSchema.safeParse(form);
    if (!result.success) {
      setErrors(fieldErrors(result));
      toast.error('Please fix the highlighted fields.');
      return;
    }
    try {
      await create.mutateAsync(result.data);
      toast.success('Timesheet submitted. Your campaign manager has been notified.');
      navigate('/submissions');
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="Timesheets"
        title="Submit a timesheet"
        description="Log your hours with supporting evidence. Reach and description are required."
      />

      <Card className="p-6">
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <Field id="campaign" label="Campaign *" error={errors.campaignCode}>
            <Select value={form.campaignCode} onValueChange={(value) => set({ campaignCode: value })}>
              <SelectTrigger id="campaign" className="w-full">
                <SelectValue placeholder="Select campaign…" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.code} value={campaign.code}>
                    {campaign.client} · {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field
            id="promotion"
            label="Promotion type *"
            error={errors.promotionType}
            hint="Please submit one timesheet per activity type, e.g. group all your WhatsApp promo into one."
          >
            <Select value={form.promotionType} onValueChange={(value) => set({ promotionType: value })}>
              <SelectTrigger id="promotion" className="w-full">
                <SelectValue placeholder="What kind of promo was this?" />
              </SelectTrigger>
              <SelectContent>
                {PROMOTION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    <span className="flex items-center gap-2">
                      <PlatformChip type={type} />
                      {PROMOTION_LABELS[type]}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="hours" label="Total hours *" error={errors.hours} hint="Enter as a decimal, e.g. 3 or 3.5.">
              <Input
                id="hours"
                type="number"
                step="0.5"
                min="0"
                inputMode="decimal"
                placeholder="e.g. 3.5"
                value={form.hours}
                onChange={(event) => set({ hours: event.target.value })}
              />
            </Field>
            <Field id="reach" label="Reach (number of people) *" error={errors.reach}>
              <Input
                id="reach"
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="e.g. 250"
                value={form.reach}
                onChange={(event) => set({ reach: event.target.value })}
              />
            </Field>
          </div>
          <p className="-mt-2 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">{REACH_GUIDANCE}</p>

          <Field id="description" label="Description *" error={errors.description}>
            <Textarea
              id="description"
              rows={4}
              placeholder="What did you do? Where, and with whom?"
              value={form.description}
              onChange={(event) => set({ description: event.target.value })}
            />
          </Field>

          <Field
            id="evidence"
            label="Supporting evidence *"
            error={errors.evidence}
            hint="Screenshots, photos or PDFs. In this demo files are not uploaded: only the file name is kept."
          >
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" size="sm" asChild>
                <label htmlFor="evidence" className="cursor-pointer">
                  <Paperclip /> Add files
                </label>
              </Button>
              <input id="evidence" type="file" multiple className="sr-only" onChange={addEvidence} />
              {form.evidence.map((name, index) => (
                <span
                  key={`${name}-${index}`}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white py-1 pl-3 pr-1 text-xs text-slate-600"
                >
                  <span className="max-w-[160px] truncate">{name}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${name}`}
                    className="rounded-full p-0.5 hover:bg-slate-100"
                    onClick={() => set({ evidence: form.evidence.filter((_, i) => i !== index) })}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          </Field>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <Checkbox
                checked={form.includeSocialLink}
                onCheckedChange={(checked) => set({ includeSocialLink: checked === true })}
              />
              Include a social media link
            </label>
            {form.includeSocialLink ? (
              <Field id="social" label="Link to your post" error={errors.socialUrl}>
                <Input
                  id="social"
                  type="url"
                  placeholder="https://"
                  value={form.socialUrl}
                  onChange={(event) => set({ socialUrl: event.target.value })}
                />
              </Field>
            ) : null}
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/submissions')}>
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending}>
              <Send /> {create.isPending ? 'Submitting…' : 'Submit timesheet'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
