import { convertJsonToCsv } from './useCsvExport';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useCsvExport.ts', () => {
  describe('convertJsonToCsv', () => {
    it('converts an array of flat objects to CSV format', () => {
      const payload = [
        { taskId: '1', status: 'COMPLETED' },
        { taskId: '2', status: 'PENDING' },
      ];

      const result = convertJsonToCsv(payload);
      
      const expected = 'taskId,status\r\n1,COMPLETED\r\n2,PENDING';
      expect(result).toBe(expected);
    });

    it('escapes commas and quotes in values', () => {
      const payload = [{ title: 'Task, with comma', desc: 'A "quote"' }];
      
      const result = convertJsonToCsv(payload);
      
      const expected = 'title,desc\r\n"Task, with comma","A ""quote"""';
      expect(result).toBe(expected);
    });

    it('returns an empty string if payload is null or empty', () => {
      expect(convertJsonToCsv([])).toBe('');
      expect(convertJsonToCsv(null)).toBe('');
    });
  });
});
