import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from './auth.store';
import { AuthService } from '../services/AuthService';
import * as TokenStorage from '../../../core/auth/token-storage';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../services/AuthService');
vi.mock('../../../core/auth/token-storage');

describe('auth.store.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('mutates state and stores tokens upon successful login', async () => {
    const store = useAuthStore();
    const mockUser = { id: '1', username: 'testuser', email: 'test@example.com', isActive: true, createdAt: '2023' };
    const mockResponse = { accessToken: 'valid.jwt.token', user: mockUser };
    
    const mockedAuthService = vi.mocked(AuthService);

    mockedAuthService.login.mockResolvedValue(mockResponse);

    await store.login({ email: 'test@example.com', password: 'password123' });

    expect(store.user).toEqual(mockUser);
    expect(store.accessToken).toBe('valid.jwt.token');
    expect(TokenStorage.setStoredAccessToken).toHaveBeenCalledWith('valid.jwt.token');
    expect(TokenStorage.setStoredUser).toHaveBeenCalledWith(mockUser);
    expect(store.status).toBe('success');
  });

  it('handles login failures and populates error messages', async () => {
    const store = useAuthStore();
    const mockError = { title: 'Invalid credentials', detail: 'User not found' };
    
    const mockedAuthService = vi.mocked(AuthService);

    mockedAuthService.login.mockRejectedValue(mockError);

    await expect(store.login({ email: 'test@example.com', password: 'wrong' })).rejects.toEqual(mockError);
    expect(store.errorMessage).toBe('User not found');
    expect(store.status).toBe('error');
  });
});
