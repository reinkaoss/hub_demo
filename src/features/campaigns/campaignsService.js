import { getDb, wait } from '@/data/store';

/** Admins see every campaign; an ambassador only the ones they are assigned to. */
const visibleTo = (viewer, db) => {
  if (viewer.role === 'admin') return db.campaigns;
  const me = db.ambassadors.find((a) => a.id === viewer.id);
  return db.campaigns.filter((c) => me?.campaigns.includes(c.code));
};

export async function fetchCampaigns(viewer) {
  await wait();
  const db = getDb();
  return visibleTo(viewer, db).map((campaign) => ({
    ...campaign,
    ambassadorCount: db.ambassadors.filter((a) => a.campaigns.includes(campaign.code) && !a.suspended).length,
  }));
}

export async function fetchCampaign(viewer, code) {
  await wait(150);
  const db = getDb();
  const campaign = visibleTo(viewer, db).find((c) => c.code === code);
  if (!campaign) return null;
  const team = db.ambassadors.filter((a) => a.campaigns.includes(code) && !a.suspended);
  const hours = db.submissions
    .filter((s) => s.campaignCode === code && (s.status === 'approved' || s.status === 'paid'))
    .reduce((total, s) => total + s.hours, 0);
  return { ...campaign, team, approvedHours: hours };
}

/** A campaign's files are only readable by someone who can see the campaign itself. */
const canSee = (viewer, db, code) => visibleTo(viewer, db).some((c) => c.code === code);

export async function fetchFolders(viewer, code) {
  await wait(100);
  const db = getDb();
  return canSee(viewer, db, code) ? db.folders.filter((f) => f.campaignCode === code) : [];
}

export async function fetchResources(viewer, code) {
  await wait(250);
  const db = getDb();
  return canSee(viewer, db, code) ? db.resources.filter((r) => r.campaignCode === code) : [];
}

/**
 * The social gallery. Posts an admin has hidden stay in the data but are removed for ambassadors,
 * which is the point of the feature: curate the gallery without touching the underlying work.
 */
export async function fetchSocialPosts(viewer, code) {
  await wait(250);
  const db = getDb();
  if (!canSee(viewer, db, code)) return [];
  return db.socialPosts
    .filter((p) => p.campaignCode === code && (viewer.role === 'admin' || !p.hidden))
    .map((p) => ({ ...p }));
}

export async function setSocialPostHidden(viewer, id, hidden) {
  await wait(150);
  if (viewer.role !== 'admin') throw new Error('Only admins can hide or show posts.');
  const post = getDb().socialPosts.find((p) => p.id === id);
  if (!post) throw new Error('That post no longer exists.');
  post.hidden = hidden;
  return { ...post };
}
