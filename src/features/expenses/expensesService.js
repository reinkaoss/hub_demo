import { getDb, wait } from '@/data/store';
import { assertExpensePayable, buildExportGroups } from './expenseRules';
import { canTransition } from '@/features/submissions/submissionRules';

const withContext = (db, expense) => ({
  ...expense,
  ambassadorName: db.ambassadors.find((a) => a.id === expense.ambassadorId)?.name ?? 'Unknown',
  campaignName: db.campaigns.find((c) => c.code === expense.campaignCode)?.client ?? expense.campaignCode,
});

export async function fetchExpenses(viewer, { status = 'all' } = {}) {
  await wait();
  const db = getDb();
  return db.expenses
    .filter((e) => viewer.role === 'admin' || e.ambassadorId === viewer.id)
    .filter((e) => status === 'all' || e.status === status)
    .map((e) => withContext(db, e))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function updateExpenseAmount(viewer, id, amount) {
  await wait(200);
  const db = getDb();
  const expense = db.expenses.find((e) => e.id === id);
  if (!expense) throw new Error('That expense no longer exists.');
  if (viewer.role !== 'admin' && expense.ambassadorId !== viewer.id) throw new Error('You can only edit your own expenses.');
  if (expense.status !== 'pending') throw new Error('Only pending expenses can be edited.');
  const value = Number(String(amount).replace(',', '.'));
  if (!Number.isFinite(value) || value <= 0) throw new Error('Enter an amount greater than £0.00.');
  expense.amount = Math.round(value * 100) / 100;
  return withContext(db, expense);
}

export async function setExpenseStatus(viewer, id, status, { reason } = {}) {
  await wait(250);
  if (viewer.role !== 'admin') throw new Error('Only admins can review expenses.');
  const db = getDb();
  const expense = db.expenses.find((e) => e.id === id);
  if (!expense) throw new Error('That expense no longer exists.');
  if (!canTransition(expense.status, status)) throw new Error(`A ${expense.status} expense cannot become ${status}.`);
  if (status === 'approved' || status === 'paid') assertExpensePayable(expense.amount);
  if (status === 'rejected' && !reason?.trim()) throw new Error('A reason is required when rejecting.');
  expense.status = status;
  expense.rejectionReason = status === 'rejected' ? reason.trim() : null;
  if (status === 'paid') expense.paidAt = Date.now();
  return withContext(db, expense);
}

export async function fetchPaidExportGroups(viewer) {
  await wait(250);
  if (viewer.role !== 'admin') throw new Error('Only admins can export payments.');
  const db = getDb();
  return buildExportGroups(
    db.expenses.filter((e) => e.status === 'paid'),
    db.ambassadors,
  );
}
