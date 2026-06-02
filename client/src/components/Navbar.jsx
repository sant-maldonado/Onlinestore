import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems, setIsOpen } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-text">
          <Package className="text-primary" size={28} />
          <span>OnlineStore</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-text-muted hover:text-text transition-colors">
            Productos
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-text-muted hover:text-text transition-colors"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1 text-sm text-secondary hover:text-secondary/80"
                >
                  <Shield size={16} />
                  Admin
                </Link>
              )}
              <span className="text-sm text-text-muted hidden sm:block">{user.name}</span>
              <button
                onClick={handleLogout}
                className="p-2 text-text-muted hover:text-danger transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <User size={16} />
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
