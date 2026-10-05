import { z } from 'zod';
import { PROMOTION_TYPES } from '@/components/PromotionTypeBadge';

/**
 * Business rules for timesheets, kept pure so they can be tested without a UI.
 *
 * Reach and description are mandatory (campaigns measure ambassador success through them), and
 * reach deliberately allows 0: "if you are putting a poster up, please write 0". Hours must be
 * positive. Whitespace alone does not count as a description.
 */
const toNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  if (typeof value === 'string') return Number(value.trim().replace(',', '.'));
  return value;
};

const requiredText = (message) =>
  z.preprocess((value) => (typeof value === 'string' ? value.trim() : (value ?? '')), z.string().min(1, message));

export const REACH_GUIDANCE =
  'For digital/social promotion, please include how many impressions and/or views your promotion received. ' +
  'For in-person promotion, please estimate how many people were present at your stall/event/shout-out. ' +
  'If you are putting a poster up, please write 0.';

export const timesheetInputSchema = z
  .object({
    campaignCode: z.string().min(1, 'Campaign is required'),
    promotionType: z.enum(PROMOTION_TYPES, { message: 'Promotion type is required' }),
    hours: z.preprocess(toNumber, z.number('Hours is required').positive('Hours must be greater than zero')),
    reach: z.preprocess(toNumber, z.number('Reach is required').nonnegative('Reach cannot be negative')),
    description: requiredText('Description is required'),
    evidence: z.array(z.string()).min(1, 'Add at least one evidence file'),
    includeSocialLink: z.boolean(),
    socialUrl: z.string().nullable().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.includeSocialLink && !/^https?:\/\/\S+$/i.test(value.socialUrl?.trim() ?? '')) {
      ctx.addIssue({ code: 'custom', path: ['socialUrl'], message: 'Enter a link starting with https://' });
    }
  });

/** First message per field, ready to render under each input. */
export function fieldErrors(result) {
  if (result.success) return {};
  const errors = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export const ZERO_VALUE_MESSAGE =
  'Nothing worth £0.00 can be approved or paid. Set a real amount first, or delete the entry.';

/**
 * The same guard the production database enforces with a trigger: a row must be worth something
 * before it can be approved. Judged on hours + bonus, so a bonus-only row (zero hours, a bonus)
 * stays valid. Without it, one worthless row can abort a whole payroll export.
 */
export function assertPayable({ hours = 0, bonus = 0 }) {
  if ((Number(hours) || 0) < 0 || (Number(bonus) || 0) < 0 || (Number(hours) || 0) + (Number(bonus) || 0) <= 0) {
    const error = new Error(ZERO_VALUE_MESSAGE);
    error.code = 'ZERO_VALUE_NOT_ALLOWED';
    throw error;
  }
}

// Allowed status transitions. Anything else is refused rather than silently applied.
const TRANSITIONS = {
  pending: ['approved', 'rejected'],
  approved: ['paid', 'rejected'],
  rejected: [],
  paid: [],
};

export const canTransition = (from, to) => TRANSITIONS[from]?.includes(to) ?? false;
