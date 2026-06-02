import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-text mb-2">Tu carrito está vacío</h2>
        <p className="text-text-muted mb-6">Agregá productos para empezar a comprar</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <ArrowLeft size={18} />
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Carrito de compras</h1>
        <button
          onClick={clearCart}
          className="text-sm text-danger hover:text-danger/80"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 bg-white border border-border rounded-xl p-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 shrink-0">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
              ) : 'Img'}
            </div>

            <div className="flex-1 min-w-0">
              <Link to={`/productos/${item.id}`} className="font-medium text-text hover:text-primary truncate block">
                {item.name}
              </Link>
              <p className="text-sm text-primary font-semibold">${(item.price / 100).toLocaleString()} c/u</p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-100 rounded-lg border border-border">
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-gray-100 rounded-lg border border-border">
                <Plus size={14} />
              </button>
            </div>

            <div className="text-right min-w-[80px]">
              <p className="font-bold text-text">${((item.price * item.quantity) / 100).toLocaleString()}</p>
            </div>

            <button onClick={() => removeItem(item.id)} className="p-2 text-gray-400 hover:text-danger transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded-xl p-6">
        <div className="flex justify-between text-lg mb-2">
          <span className="text-text-muted">Subtotal</span>
          <span className="font-semibold">${(totalPrice / 100).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-lg mb-2">
          <span className="text-text-muted">Envío</span>
          <span className="font-semibold text-success">Gratis</span>
        </div>
        <div className="border-t border-border my-3" />
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>${(totalPrice / 100).toLocaleString()}</span>
        </div>

        <Link
          to="/checkout"
          className="mt-4 block w-full text-center bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          Proceder al pago
        </Link>
      </div>
    </div>
  );
}
