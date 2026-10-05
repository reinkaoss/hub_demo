import { getDb, wait } from '@/data/store';

export async function fetchAmbassadors(viewer, { search = '', status = 'all', activation = 'all' } = {}) {
  await wait();
  if (viewer.role !== 'admin') throw new Error('Only admins can view the ambassador list.');
  const term = search.trim().toLowerCase();
  return getDb()
    .ambassadors.filter((a) => status === 'all' || (status === 'suspended' ? a.suspended : !a.suspended))
    .filter((a) => activation === 'all' || (activation === 'activated' ? a.activated : !a.activated))
    .filter((a) => !term || a.name.toLowerCase().includes(term) || a.email.toLowerCase().includes(term))
    .map((a) => ({ ...a }));
}

export async function setSuspended(viewer, id, suspended) {
  await wait(200);
  if (viewer.role !== 'admin') throw new Error('Only admins can suspend ambassadors.');
  const ambassador = getDb().ambassadors.find((a) => a.id === id);
  if (!ambassador) throw new Error('That ambassador no longer exists.');
  ambassador.suspended = suspended;
  // A suspended ambassador is never "online", whatever their last heartbeat said.
  if (suspended) ambassador.online = false;
  return { ...ambassador };
}
