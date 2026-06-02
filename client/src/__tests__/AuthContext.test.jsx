import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';

vi.mock('../services/api', () => {
  const mockLogin = vi.fn();
  const mockRegister = vi.fn();

  return {
    authApi: {
      login: mockLogin,
      register: mockRegister,
    },
    default: {
      interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    },
  };
});

import { authApi } from '../services/api';

function TestComponent() {
  const { user, token, loading, error, login, register, logout, isAdmin } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? JSON.stringify(user) : 'null'}</span>
      <span data-testid="token">{token || 'null'}</span>
      <span data-testid="loading">{loading ? 'true' : 'false'}</span>
      <span data-testid="error">{error || ''}</span>
      <span data-testid="isAdmin">{isAdmin ? 'true' : 'false'}</span>
      <button data-testid="btn-login" onClick={() => login('test@test.com', 'pass123')}>
        Login
      </button>
      <button data-testid="btn-register" onClick={() => register('new@test.com', 'New', 'pass123')}>
        Register
      </button>
      <button data-testid="btn-logout" onClick={() => logout()}>
        Logout
      </button>
    </div>
  );
}

function renderAuth() {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should start with null user and token', () => {
    renderAuth();
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(screen.getByTestId('token').textContent).toBe('null');
    expect(screen.getByTestId('isAdmin').textContent).toBe('false');
  });

  it('should login and set user and token', async () => {
    authApi.login.mockResolvedValue({
      data: { token: 'fake-jwt', user: { id: '1', email: 'test@test.com', name: 'Test', role: 'USER' } },
    });

    renderAuth();
    act(() => { fireEvent.click(screen.getByTestId('btn-login')); });

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).not.toBe('null');
    });

    const user = JSON.parse(screen.getByTestId('user').textContent);
    expect(user.email).toBe('test@test.com');
    expect(user.role).toBe('USER');
    expect(screen.getByTestId('isAdmin').textContent).toBe('false');
  });

  it('should detect admin role after login', async () => {
    authApi.login.mockResolvedValue({
      data: { token: 'admin-jwt', user: { id: '2', email: 'admin@test.com', name: 'Admin', role: 'ADMIN' } },
    });

    renderAuth();
    act(() => { fireEvent.click(screen.getByTestId('btn-login')); });

    await waitFor(() => {
      expect(screen.getByTestId('isAdmin').textContent).toBe('true');
    });
  });

  it('should clear user and token on logout', async () => {
    authApi.login.mockResolvedValue({
      data: { token: 'fake-jwt', user: { id: '1', email: 'test@test.com', name: 'Test', role: 'USER' } },
    });

    renderAuth();
    act(() => { fireEvent.click(screen.getByTestId('btn-login')); });

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).not.toBe('null');
    });

    act(() => { fireEvent.click(screen.getByTestId('btn-logout')); });

    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(screen.getByTestId('token').textContent).toBe('null');
  });

  it('should set error on login failure', async () => {
    authApi.login.mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } },
    });

    renderAuth();
    act(() => { fireEvent.click(screen.getByTestId('btn-login')); });

    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe('Invalid credentials');
    });

    await act(async () => {
      await new Promise(r => setTimeout(r, 100));
    });
  });
});
