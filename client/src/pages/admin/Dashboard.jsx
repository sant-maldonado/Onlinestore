import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Package, ShoppingCart, Users, DollarSign, Box, ClipboardList } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/api';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi.getStats().then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  if (!user || !isAdmin) return <Navigate to="/" />;

  const cards = [
    { label: 'Productos', value: stats?.totalProducts ?? '...', icon: Box, color: 'text-primary', bg: 'bg-primary/10', link: '/admin/productos' },
    { label: 'Órdenes', value: stats?.totalOrders ?? '...', icon: ClipboardList, color: 'text-secondary', bg: 'bg-secondary/10', link: '/admin/ordenes' },
    { label: 'Usuarios', value: stats?.totalUsers ?? '...', icon: Users, color: 'text-success', bg: 'bg-success/10', link: '#' },
    { label: 'Ingresos totales', value: stats ? `$${(stats.totalRevenue / 100).toLocaleString()}` : '...', icon: DollarSign, color: 'text-accent', bg: 'bg-accent/10', link: '#' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">Panel de Administración</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(card => (
          <Link
            key={card.label}
            to={card.link}
            className="bg-white border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex p-3 rounded-lg ${card.bg} ${card.color} mb-4`}>
              <card.icon size={24} />
            </div>
            <p className="text-2xl font-bold text-text">{card.value}</p>
            <p className="text-sm text-text-muted">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          to="/admin/productos"
          className="flex items-center gap-4 bg-white border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
        >
          <Package size={32} className="text-primary" />
          <div>
            <h3 className="font-semibold text-text">Gestionar Productos</h3>
            <p className="text-sm text-text-muted">Crear, editar y eliminar productos</p>
          </div>
        </Link>
        <Link
          to="/admin/ordenes"
          className="flex items-center gap-4 bg-white border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
        >
          <ShoppingCart size={32} className="text-secondary" />
          <div>
            <h3 className="font-semibold text-text">Gestionar Órdenes</h3>
            <p className="text-sm text-text-muted">Ver y actualizar estado de órdenes</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
