import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Home, Package } from 'lucide-react';
import { ordersApi } from '../services/api';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      ordersApi.getMine().then(({ data }) => {
        if (data.length > 0) setOrder(data[0]);
      }).catch(() => {});
    }
  }, [sessionId]);

  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <CheckCircle size={72} className="mx-auto text-success mb-6" />
      <h1 className="text-3xl font-bold text-text mb-2">¡Pago exitoso!</h1>
      <p className="text-text-muted mb-2">Gracias por tu compra</p>
      {order && (
        <p className="text-sm text-text-muted mb-8">
          Orden #{order.id.slice(0, 8)} — ${(order.total / 100).toLocaleString()}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Home size={18} />
          Seguir comprando
        </Link>
        <Link
          to="/admin/ordenes"
          className="inline-flex items-center justify-center gap-2 border border-border text-text px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Package size={18} />
          Mis órdenes
        </Link>
      </div>
    </div>
  );
}
