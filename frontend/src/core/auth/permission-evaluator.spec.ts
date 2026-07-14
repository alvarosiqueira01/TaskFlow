import { hasRole, hasPermission } from './permission-evaluator';
import type { User } from './types/auth.types';
import { ROLE_NAMES } from '../constants/permissions.constants';

describe('permission-evaluator.ts', () => {
  const adminUser: User = {
    id: '1',
    username: 'admin',
    email: 'admin@test.com',
    isActive: true,
    roles: [{ id: 'r1', name: ROLE_NAMES.ADMINISTRATOR }],
    createdAt: '2023-01-01',
  };

  const standardUser: User = {
    id: '2',
    username: 'user',
    email: 'user@test.com',
    isActive: true,
    roles: [{ id: 'r2', name: ROLE_NAMES.AUTHENTICATED_USER }],
    createdAt: '2023-01-01',
  };

  describe('hasRole', () => {
    it('returns true if the user has the specified role', () => {
      expect(hasRole(adminUser, ROLE_NAMES.ADMINISTRATOR)).toBe(true);
    });

    it('returns false if the user lacks the role or has no roles', () => {
      expect(hasRole(standardUser, ROLE_NAMES.ADMINISTRATOR)).toBe(false);
      expect(hasRole(null, ROLE_NAMES.ADMINISTRATOR)).toBe(false);
    });
  });

  describe('hasPermission', () => {
    it('evaluates permission correctly against constants', () => {
      // MANAGE_USERS is [ROLE_NAMES.ADMINISTRATOR]
      expect(hasPermission(adminUser, 'MANAGE_USERS')).toBe(true);
      expect(hasPermission(standardUser, 'MANAGE_USERS')).toBe(false);
    });
  });
});