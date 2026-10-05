/**
 * Money is summed in integer pennies and only divided by 100 for display. Adding pounds as floats
 * drifts (0.1 + 0.2 !== 0.3), and a payment run has to reconcile to the penny.
 */
export const toPennies = (pounds) => Math.round((Number(pounds) || 0) * 100);

export const sumPennies = (amounts) => amounts.reduce((total, pounds) => total + toPennies(pounds), 0);

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
export const formatPennies = (pennies) => gbp.format(pennies / 100);
export const formatGBP = (pounds) => gbp.format(Number(pounds) || 0);
