import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Carrito ({totalItems})</h2>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-text-muted">
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {items.map(item => (
                <div key={item.id} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                    ) : (
                      'Img'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-sm text-primary font-semibold">${(item.price / 100).toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-gray-200 rounded">
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-200 rounded">
                        <Plus size={14} />
                      </button>
                      <button onClick={() => removeItem(item.id)} className="ml-auto p-1 text-danger hover:bg-red-50 rounded">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-4 space-y-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${(totalPrice / 100).toLocaleString()}</span>
              </div>
              <Link
                to="/carrito"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-primary text-white py-2.5 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Ver carrito
              </Link>
              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-secondary text-white py-2.5 rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Pagar ahora
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
