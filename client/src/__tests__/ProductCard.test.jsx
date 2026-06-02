import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

function renderCard(product) {
  return render(
    <MemoryRouter>
      <CartProvider>
        <ProductCard product={product} />
      </CartProvider>
    </MemoryRouter>
  );
}

const baseProduct = {
  id: 'p1',
  name: 'Auriculares Bluetooth',
  price: 8999,
  stock: 10,
  image: 'https://example.com/img.jpg',
  description: 'Excelentes auriculares',
  category: { name: 'Electrónica' },
};

describe('ProductCard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render product name', () => {
    renderCard(baseProduct);
    expect(screen.getByText('Auriculares Bluetooth')).toBeDefined();
  });

  it('should render formatted price in dollars', () => {
    renderCard(baseProduct);
    expect(screen.getByText('$89.99')).toBeDefined();
  });

  it('should render category name', () => {
    renderCard(baseProduct);
    expect(screen.getByText('Electrónica')).toBeDefined();
  });

  it('should show stock count when in stock', () => {
    renderCard(baseProduct);
    expect(screen.getByText('10 uds.')).toBeDefined();
  });

  it('should show "Sin stock" when stock is 0', () => {
    renderCard({ ...baseProduct, stock: 0 });
    expect(screen.getByText('Sin stock')).toBeDefined();
  });

  it('should disable add to cart button when out of stock', () => {
    renderCard({ ...baseProduct, stock: 0 });
    const button = screen.getByRole('button');
    expect(button.disabled).toBe(true);
  });

  it('should enable add to cart button when in stock', () => {
    renderCard(baseProduct);
    const button = screen.getByRole('button');
    expect(button.disabled).toBe(false);
  });

  it('should show "Sin imagen" placeholder when no image', () => {
    renderCard({ ...baseProduct, image: null });
    expect(screen.getByText('Sin imagen')).toBeDefined();
  });

  it('should have a link to product detail', () => {
    renderCard(baseProduct);
    const links = screen.getAllByRole('link');
    const productLink = links.find(l => l.getAttribute('href') === '/productos/p1');
    expect(productLink).toBeDefined();
  });

  it('should show description', () => {
    renderCard(baseProduct);
    expect(screen.getByText('Excelentes auriculares')).toBeDefined();
  });

  it('should call addItem when clicking add to cart', () => {
    renderCard(baseProduct);
    const button = screen.getByRole('button');
    act(() => { fireEvent.click(button); });

    const saved = JSON.parse(localStorage.getItem('cart'));
    expect(saved).toHaveLength(1);
    expect(saved[0].id).toBe('p1');
    expect(saved[0].quantity).toBe(1);
  });
});
