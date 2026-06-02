import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';

function TestComponent() {
  const cart = useCart();
  return (
    <div>
      <span data-testid="total-items">{cart.totalItems}</span>
      <span data-testid="total-price">{cart.totalPrice}</span>
      <span data-testid="items-count">{cart.items.length}</span>
      <ul>
        {cart.items.map(item => (
          <li key={item.id} data-testid={`item-${item.id}`}>
            {item.name} x{item.quantity} - ${item.price}
          </li>
        ))}
      </ul>
      <button data-testid="add-item" onClick={() => cart.addItem({ id: 'p1', name: 'Test Product', price: 1000 })}>
        Add Item
      </button>
      <button data-testid="add-item-again" onClick={() => cart.addItem({ id: 'p1', name: 'Test Product', price: 1000 })}>
        Add Same Item
      </button>
      <button data-testid="add-item-2" onClick={() => cart.addItem({ id: 'p2', name: 'Second Product', price: 2000 }, 3)}>
        Add Item 2 x3
      </button>
      <button data-testid="remove-item" onClick={() => cart.removeItem('p1')}>
        Remove Item
      </button>
      <button data-testid="update-qty" onClick={() => cart.updateQuantity('p1', 5)}>
        Set Qty 5
      </button>
      <button data-testid="clear-cart" onClick={() => cart.clearCart()}>
        Clear Cart
      </button>
    </div>
  );
}

function renderCart() {
  return render(
    <CartProvider>
      <TestComponent />
    </CartProvider>
  );
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should start with empty cart', () => {
    renderCart();
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('total-price').textContent).toBe('0');
    expect(screen.getByTestId('items-count').textContent).toBe('0');
  });

  it('should add item to cart', () => {
    renderCart();
    act(() => { fireEvent.click(screen.getByTestId('add-item')); });

    expect(screen.getByTestId('total-items').textContent).toBe('1');
    expect(screen.getByTestId('items-count').textContent).toBe('1');
    expect(screen.getByTestId('total-price').textContent).toBe('1000');
  });

  it('should increase quantity when adding same item', () => {
    renderCart();
    act(() => { fireEvent.click(screen.getByTestId('add-item')); });
    act(() => { fireEvent.click(screen.getByTestId('add-item-again')); });

    expect(screen.getByTestId('total-items').textContent).toBe('2');
    expect(screen.getByTestId('items-count').textContent).toBe('1');
    expect(screen.getByTestId('total-price').textContent).toBe('2000');
  });

  it('should add multiple different items', () => {
    renderCart();
    act(() => { fireEvent.click(screen.getByTestId('add-item')); });
    act(() => { fireEvent.click(screen.getByTestId('add-item-2')); });

    expect(screen.getByTestId('total-items').textContent).toBe('4');
    expect(screen.getByTestId('items-count').textContent).toBe('2');
    expect(screen.getByTestId('total-price').textContent).toBe('7000');
  });

  it('should remove item from cart', () => {
    renderCart();
    act(() => { fireEvent.click(screen.getByTestId('add-item')); });
    act(() => { fireEvent.click(screen.getByTestId('add-item-2')); });
    act(() => { fireEvent.click(screen.getByTestId('remove-item')); });

    expect(screen.getByTestId('items-count').textContent).toBe('1');
    expect(screen.getByTestId('total-items').textContent).toBe('3');
  });

  it('should update item quantity', () => {
    renderCart();
    act(() => { fireEvent.click(screen.getByTestId('add-item')); });
    act(() => { fireEvent.click(screen.getByTestId('update-qty')); });

    expect(screen.getByTestId('total-items').textContent).toBe('5');
    expect(screen.getByTestId('total-price').textContent).toBe('5000');
  });

  it('should clear cart', () => {
    renderCart();
    act(() => { fireEvent.click(screen.getByTestId('add-item')); });
    act(() => { fireEvent.click(screen.getByTestId('add-item-2')); });
    act(() => { fireEvent.click(screen.getByTestId('clear-cart')); });

    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('items-count').textContent).toBe('0');
  });

  it('should persist to localStorage', () => {
    renderCart();
    act(() => { fireEvent.click(screen.getByTestId('add-item')); });

    const saved = JSON.parse(localStorage.getItem('cart'));
    expect(saved).toHaveLength(1);
    expect(saved[0].id).toBe('p1');
    expect(saved[0].quantity).toBe(1);
  });
});
