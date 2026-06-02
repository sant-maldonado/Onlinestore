import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';

function AllProviders({ children, initialEntries = ['/'] }) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

function renderWithProviders(ui, options = {}) {
  return render(ui, { wrapper: () => <AllProviders {...options}>{ui}</AllProviders>, ...options });
}

export { renderWithProviders, AllProviders };
