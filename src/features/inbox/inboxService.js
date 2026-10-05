import { getDb, nextId, wait } from '@/data/store';

const CANNED_REPLIES = [
  'Thanks, that makes sense. I will sort it today.',
  'Got it! Will do.',
  'Perfect, thank you for the quick reply.',
  'Brilliant, I will get that over to you later this week.',
];

const canAccess = (viewer, thread) => viewer.role === 'admin' || thread.ambassadorId === viewer.id;

const unreadFor = (viewer, thread) => (viewer.role === 'admin' ? thread.unreadForAdmin : thread.unreadForAmbassador);

export async function fetchThreads(viewer) {
  await wait(150);
  const db = getDb();
  return db.threads
    .filter((t) => viewer.role === 'admin' || t.ambassadorId === viewer.id)
    .map((t) => ({
      ...t,
      ambassadorName: db.ambassadors.find((a) => a.id === t.ambassadorId)?.name ?? 'Unknown',
      campaignName: db.campaigns.find((c) => c.code === t.campaignCode)?.client ?? t.campaignCode,
      unread: unreadFor(viewer, t),
      last: t.messages.at(-1),
    }))
    .sort((a, b) => b.last.at - a.last.at);
}

export async function markThreadRead(viewer, id) {
  await wait(60);
  const thread = getDb().threads.find((t) => t.id === id);
  if (!thread || !canAccess(viewer, thread)) return;
  if (viewer.role === 'admin') thread.unreadForAdmin = false;
  else thread.unreadForAmbassador = false;
}

export async function sendMessage(viewer, id, text) {
  await wait(150);
  const body = text.trim();
  if (!body) throw new Error('Write a message first.');
  const thread = getDb().threads.find((t) => t.id === id);
  if (!thread || !canAccess(viewer, thread)) throw new Error('That conversation no longer exists.');
  thread.messages.push({ id: nextId('MSG'), from: viewer.role, author: viewer.name, text: body, at: Date.now() });
  // The OTHER side now has something unread.
  if (viewer.role === 'admin') thread.unreadForAmbassador = true;
  else thread.unreadForAdmin = true;
  return thread;
}

/** Demo only: the ambassador answers an admin's message a moment later, as a real one might. */
export async function simulateReply(id) {
  const db = getDb();
  const thread = db.threads.find((t) => t.id === id);
  if (!thread) return;
  const ambassador = db.ambassadors.find((a) => a.id === thread.ambassadorId);
  thread.messages.push({
    id: nextId('MSG'),
    from: 'ambassador',
    author: ambassador?.name ?? 'Ambassador',
    text: CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)],
    at: Date.now(),
  });
  thread.unreadForAdmin = true;
}
