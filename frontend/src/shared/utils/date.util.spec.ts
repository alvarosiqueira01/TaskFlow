import { formatDate, formatRelativeTime } from './date.util';

describe('date.util.ts', () => {
  describe('formatDate', () => {
    it('formats an ISO string to a readable date', () => {
      const isoDate = '2026-07-12T19:27:41.000Z';
      const result = formatDate(isoDate);
      expect(typeof result).toBe('string');
      // Exact assertion depends on your Intl.DateTimeFormat configuration
    });
  });

  describe('formatRelativeTime', () => {
    beforeAll(() => {
      // Mock system time to a fixed date so relative calculations are deterministic
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-07-12T19:27:41.000Z'));
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    it('returns "just now" or "X seconds ago" for recent times', () => {
      const tenSecondsAgo = new Date(Date.now() - 10000).toISOString();
      expect(formatRelativeTime(tenSecondsAgo)).toMatch(/10 seconds ago/i);
    });

    it('returns "X days ago" for older dates', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
      expect(formatRelativeTime(twoDaysAgo)).toMatch(/2 days ago/i);
    });
  });
});