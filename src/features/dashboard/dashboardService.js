import { getDb, wait } from '@/data/store';
import { formatPennies, sumPennies } from '@/lib/money';

/**
 * Headline numbers for the signed-in role. The same rows, scoped: an admin sees the whole
 * programme, an ambassador sees only their own work.
 */
export async function fetchDashboard(viewer) {
  await wait(220);
  const db = getDb();
  const admin = viewer.role === 'admin';
  const mine = (row) => admin || row.ambassadorId === viewer.id;

  const timesheets = db.submissions.filter(mine);
  const expenses = db.expenses.filter(mine);
  const countable = timesheets.filter((s) => s.status === 'approved' || s.status === 'paid');
  const pendingExpenses = expenses.filter((e) => e.status === 'pending');

  const hoursByCampaign = db.campaigns
    .map((campaign) => ({
      code: campaign.code,
      label: `${campaign.client} · ${campaign.name}`,
      hue: campaign.hue,
      hours: countable.filter((s) => s.campaignCode === campaign.code).reduce((sum, s) => sum + s.hours, 0),
    }))
    .filter((row) => row.hours > 0)
    .sort((a, b) => b.hours - a.hours);

  const nameOf = (id) => db.ambassadors.find((a) => a.id === id)?.name ?? 'Unknown';
  const activity = [
    ...timesheets.map((s) => ({
      id: s.id,
      kind: 'timesheet',
      who: nameOf(s.ambassadorId),
      text: `${s.hours ? `${s.hours}h timesheet` : 'Bonus'} for ${s.campaignCode}`,
      status: s.status,
      at: s.createdAt,
    })),
    ...expenses.map((e) => ({
      id: e.id,
      kind: 'expense',
      who: nameOf(e.ambassadorId),
      text: `Expense for ${e.campaignCode}`,
      status: e.status,
      at: e.createdAt,
    })),
  ]
    .sort((a, b) => b.at - a.at)
    .slice(0, 6);

  const unreadMessages = db.threads
    .filter((t) => admin || t.ambassadorId === viewer.id)
    .filter((t) => (admin ? t.unreadForAdmin : t.unreadForAmbassador)).length;

  return {
    admin,
    pendingTimesheets: timesheets.filter((s) => s.status === 'pending').length,
    pendingExpenseCount: pendingExpenses.length,
    pendingExpenseTotal: formatPennies(sumPennies(pendingExpenses.map((e) => e.amount))),
    approvedHours: countable.reduce((sum, s) => sum + s.hours, 0),
    unreadMessages,
    online: admin ? db.ambassadors.filter((a) => a.online && !a.suspended).length : null,
    totalAmbassadors: admin ? db.ambassadors.filter((a) => !a.suspended).length : null,
    hoursByCampaign,
    activity,
  };
}
