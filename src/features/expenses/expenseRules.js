import { formatPennies, sumPennies, toPennies } from '@/lib/money';
import { ZERO_VALUE_MESSAGE } from '@/features/submissions/submissionRules';

export function assertExpensePayable(amount) {
  if (!(Number(amount) > 0)) {
    const error = new Error(ZERO_VALUE_MESSAGE);
    error.code = 'ZERO_VALUE_NOT_ALLOWED';
    throw error;
  }
}

export const totalsByStatus = (rows) => {
  const total = (status) => formatPennies(sumPennies(rows.filter((r) => r.status === status).map((r) => r.amount)));
  return { pending: total('pending'), approved: total('approved'), paid: total('paid') };
};

/**
 * One payment line per ambassador / campaign / chargeback, totalled in integer pennies and rounded
 * once. This is what payroll receives, so the on-screen total, the group totals and the sum of the
 * CSV lines all agree to the penny.
 */
export function buildExportGroups(rows, ambassadors) {
  const groups = new Map();
  for (const row of rows) {
    const key = `${row.ambassadorId}|${row.campaignCode}|${row.isChargeback ? 'cb' : 'exp'}`;
    const group = groups.get(key) ?? {
      employeeCode: row.ambassadorId,
      ambassadorName: ambassadors.find((a) => a.id === row.ambassadorId)?.name ?? '',
      campaignCode: row.campaignCode,
      isChargeback: row.isChargeback,
      pennies: 0,
      paidAt: 0,
    };
    group.pennies += toPennies(row.amount);
    group.paidAt = Math.max(group.paidAt, row.paidAt ?? 0);
    groups.set(key, group);
  }
  return [...groups.values()];
}

const csvCell = (value) => `"${String(value).replace(/"/g, '""')}"`;

export function groupsToCsv(groups) {
  const header = ['Employee ID', 'Description', 'Amount', 'Chargeback', 'Paid Date', 'Ambassador Name'];
  const lines = groups.map((g) => [
    g.employeeCode,
    `expense ${g.campaignCode}`,
    (g.pennies / 100).toFixed(2),
    g.isChargeback ? 'TRUE' : 'FALSE',
    g.paidAt ? new Date(g.paidAt).toISOString().slice(0, 10) : '',
    g.ambassadorName,
  ]);
  return [header, ...lines].map((line) => line.map(csvCell).join(',')).join('\n');
}
