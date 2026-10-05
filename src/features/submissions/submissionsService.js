import { getDb, nextId, wait } from '@/data/store';
import { svgArt } from '@/data/art';
import { assertPayable, canTransition } from './submissionRules';

function withContext(db, submission) {
  const ambassador = db.ambassadors.find((a) => a.id === submission.ambassadorId);
  const campaign = db.campaigns.find((c) => c.code === submission.campaignCode);
  return {
    ...submission,
    ambassadorName: ambassador?.name ?? 'Unknown',
    campaignName: campaign ? `${campaign.client} · ${campaign.name}` : submission.campaignCode,
  };
}

/** Admins see every row; an ambassador only ever sees their own (the real app does this in RLS). */
export async function fetchSubmissions(viewer, { status = 'all', search = '' } = {}) {
  await wait();
  const db = getDb();
  const term = search.trim().toLowerCase();
  return db.submissions
    .filter((s) => viewer.role === 'admin' || s.ambassadorId === viewer.id)
    .filter((s) => status === 'all' || s.status === status)
    .map((s) => withContext(db, s))
    .filter(
      (s) =>
        !term ||
        s.ambassadorName.toLowerCase().includes(term) ||
        s.campaignName.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term),
    )
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function createSubmission(viewer, input) {
  await wait(300);
  const db = getDb();
  if (viewer.role !== 'ambassador') throw new Error('Timesheets are submitted by ambassadors.');
  const me = db.ambassadors.find((a) => a.id === viewer.id);
  if (!me?.campaigns.includes(input.campaignCode)) throw new Error('You are not assigned to that campaign.');
  const row = {
    id: nextId('SUB'),
    ambassadorId: viewer.id,
    campaignCode: input.campaignCode,
    type: 'timesheet',
    status: 'pending',
    hours: input.hours,
    bonus: 0,
    reach: input.reach,
    description: input.description,
    promotionType: input.promotionType,
    socialUrl: input.includeSocialLink ? input.socialUrl.trim() : null,
    createdAt: Date.now(),
    rejectionReason: null,
  };
  db.submissions.unshift(row);
  return withContext(db, row);
}

export async function setSubmissionStatus(viewer, id, status, { reason } = {}) {
  await wait(250);
  if (viewer.role !== 'admin') throw new Error('Only admins can review submissions.');
  const db = getDb();
  const submission = db.submissions.find((s) => s.id === id);
  if (!submission) throw new Error('That submission no longer exists.');
  if (!canTransition(submission.status, status)) {
    throw new Error(`A ${submission.status} submission cannot become ${status}.`);
  }
  if (status === 'approved' || status === 'paid') assertPayable(submission);
  if (status === 'rejected' && !reason?.trim()) throw new Error('A reason is required when rejecting.');

  submission.status = status;
  submission.rejectionReason = status === 'rejected' ? reason.trim() : null;

  // Approving a submission that carries a social link publishes it to the campaign gallery.
  if (status === 'approved' && submission.socialUrl && !db.socialPosts.some((p) => p.submissionId === id)) {
    const ambassador = db.ambassadors.find((a) => a.id === submission.ambassadorId);
    db.socialPosts.unshift({
      id: nextId('POST'),
      submissionId: id,
      campaignCode: submission.campaignCode,
      ambassadorId: submission.ambassadorId,
      platform: submission.promotionType,
      handle: ambassador?.name ?? 'Ambassador',
      caption: submission.description,
      likes: 0,
      hidden: false,
      art: svgArt(`${id}${submission.promotionType}`, { variant: 'photo' }),
    });
  }
  return withContext(db, submission);
}
