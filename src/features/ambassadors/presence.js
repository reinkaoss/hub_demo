import { timeAgo } from '@/lib/time';

/**
 * One place that turns an ambassador's raw state into what an admin should read:
 * live ("Online now"), recently seen, or never activated (invited but never signed in).
 */
export function describePresence(ambassador, now = Date.now()) {
  if (!ambassador.activated) return { tone: 'never', label: 'Never signed in' };
  if (ambassador.online) return { tone: 'online', label: 'Online now' };
  return { tone: 'idle', label: `Last seen ${timeAgo(ambassador.lastSeenAt, now)}` };
}
