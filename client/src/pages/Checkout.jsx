import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { paymentsApi } from '../services/api';
import CheckoutForm from '../components/CheckoutForm';

export default function Checkout() {
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) return <Navigate to="/login" />;
  if (items.length === 0) return <Navigate to="/carrito" />;

  const handleCheckout = async (shippingData) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await paymentsApi.checkout({
        items: items.map(i => ({ id: i.id, quantity: i.quantity })),
        ...shippingData,
      });
      clearCart();
      window.location.href = data.url;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar el pago');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-text mb-6">Checkout</h1>

      {error && (
        <div className="bg-red-50 text-danger text-sm p-3 rounded-lg mb-4">{error}</div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-text mb-4">Datos de envío</h2>
          <CheckoutForm onSubmit={handleCheckout} loading={loading} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text mb-4">Resumen del pedido</h2>
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-text-muted">
                  {item.name} <span className="font-medium text-text">x{item.quantity}</span>
                </span>
                <span className="font-medium">${((item.price * item.quantity) / 100).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-border pt-3" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${(totalPrice / 100).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted bg-white rounded-lg p-3 border border-border">
              <CreditCard size={16} />
              <span>Pago seguro via Stripe. Tarjetas de prueba: 4242 4242 4242 4242</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
