import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import Navbar from '../components/Navbar';

vi.mock('../services/api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
  },
  default: {
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
}));

function renderNav() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should show brand name', () => {
    renderNav();
    expect(screen.getByText('OnlineStore')).toBeDefined();
  });

  it('should show "Ingresar" button when user is not authenticated', () => {
    renderNav();
    expect(screen.getByText('Ingresar')).toBeDefined();
  });

  it('should show login link pointing to /login', () => {
    renderNav();
    const link = screen.getByText('Ingresar').closest('a');
    expect(link.getAttribute('href')).toBe('/login');
  });

  it('should show user name when authenticated', () => {
    localStorage.setItem('token', 'fake-jwt');
    localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@test.com', name: 'Test User', role: 'USER' }));

    renderNav();
    expect(screen.getByText('Test User')).toBeDefined();
  });

  it('should show logout button when authenticated', () => {
    localStorage.setItem('token', 'fake-jwt');
    localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@test.com', name: 'Test User', role: 'USER' }));

    renderNav();
    const logoutBtn = screen.getByTitle('Cerrar sesión');
    expect(logoutBtn).toBeDefined();
  });

  it('should not show Admin link for regular users', () => {
    localStorage.setItem('token', 'fake-jwt');
    localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@test.com', name: 'Test', role: 'USER' }));

    renderNav();
    expect(screen.queryByRole('link', { name: /admin/i })).toBeNull();
  });

  it('should show Admin link for admin users', () => {
    localStorage.setItem('token', 'admin-jwt');
    localStorage.setItem('user', JSON.stringify({ id: '2', email: 'admin@test.com', name: 'Admin', role: 'ADMIN' }));

    renderNav();
    const adminLink = screen.getByRole('link', { name: /admin/i });
    expect(adminLink).toBeDefined();
    expect(adminLink.getAttribute('href')).toBe('/admin/dashboard');
  });

  it('should show cart badge when items are in cart', () => {
    localStorage.setItem('cart', JSON.stringify([{ id: 'p1', quantity: 3 }]));
    localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@test.com', name: 'Test', role: 'USER' }));

    renderNav();
    expect(screen.getByText('3')).toBeDefined();
  });

  it('should not show cart badge when cart is empty', () => {
    renderNav();
    const badge = screen.queryByTestId('cart-badge');
    expect(badge).toBeNull();
  });
});
