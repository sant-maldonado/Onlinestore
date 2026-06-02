import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/api';

const STATUSES = ['', 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const STATUS_LABELS = { '': 'Todos', PENDING: 'Pendiente', PAID: 'Pagado', SHIPPED: 'Enviado', DELIVERED: 'Entregado', CANCELLED: 'Cancelado' };
const STATUS_COLORS = { PENDING: 'bg-warning/10 text-warning', PAID: 'bg-success/10 text-success', SHIPPED: 'bg-primary/10 text-primary', DELIVERED: 'bg-secondary/10 text-secondary', CANCELLED: 'bg-danger/10 text-danger' };

export default function Orders() {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    adminApi.getOrders(filter || undefined).then(({ data }) => setOrders(data)).catch(() => {});
  }, [filter]);

  if (!user || !isAdmin) return <Navigate to="/" />;

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await adminApi.updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? data : o));
      if (selected?.id === id) setSelected(data);
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">Órdenes</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === s ? 'bg-primary text-white' : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="text-left p-3 font-medium text-text-muted">#</th>
                  <th className="text-left p-3 font-medium text-text-muted">Cliente</th>
                  <th className="text-right p-3 font-medium text-text-muted">Total</th>
                  <th className="text-center p-3 font-medium text-text-muted">Estado</th>
                  <th className="text-right p-3 font-medium text-text-muted">Fecha</th>
                  <th className="text-right p-3 font-medium text-text-muted"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs">{o.id.slice(0, 8)}</td>
                    <td className="p-3">
                      <p className="font-medium text-text">{o.user?.name}</p>
                      <p className="text-text-muted text-xs">{o.user?.email}</p>
                    </td>
                    <td className="p-3 text-right font-medium">${(o.total / 100).toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-500'}`}>
                        {STATUS_LABELS[o.status]}
                      </span>
                    </td>
                    <td className="p-3 text-right text-text-muted text-xs">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => setSelected(o)} className="p-1.5 text-text-muted hover:text-primary rounded">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <p className="p-6 text-center text-text-muted">No hay órdenes</p>
          )}
        </div>

        <div className="bg-white border border-border rounded-xl p-4">
          {selected ? (
            <div>
              <h3 className="font-semibold text-text mb-3">
                Orden #{selected.id.slice(0, 8)}
              </h3>

              <div className="space-y-2 text-sm mb-4">
                <p><span className="text-text-muted">Cliente:</span> <span className="font-medium">{selected.user?.name}</span></p>
                <p><span className="text-text-muted">Email:</span> {selected.user?.email}</p>
                <p><span className="text-text-muted">Fecha:</span> {new Date(selected.createdAt).toLocaleString()}</p>
                <p><span className="text-text-muted">Total:</span> <span className="font-bold">${(selected.total / 100).toLocaleString()}</span></p>
                {selected.shippingAddress && (
                  <p><span className="text-text-muted">Envío:</span> {selected.shippingAddress}, {selected.city}</p>
                )}
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-text mb-2">Productos</h4>
                {selected.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span className="text-text-muted">{item.product?.name} x{item.quantity}</span>
                    <span className="font-medium">${((item.price * item.quantity) / 100).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-medium text-text mb-2">Cambiar estado</h4>
                <div className="flex flex-wrap gap-1">
                  {STATUSES.filter(Boolean).map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selected.id, s)}
                      disabled={s === selected.status}
                      className={`text-xs px-2 py-1 rounded border transition-colors ${
                        s === selected.status
                          ? 'bg-primary text-white border-primary'
                          : 'border-border text-text-muted hover:bg-gray-50'
                      }`}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-text-muted py-8 text-sm">
              <Search size={32} className="mx-auto mb-2 text-gray-300" />
              Seleccioná una orden para ver detalles
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
