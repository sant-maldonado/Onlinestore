import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const inStock = product.stock > 0;

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/productos/${product.id}`}>
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-sm">Sin imagen</span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          {product.category?.name}
        </span>

        <Link to={`/productos/${product.id}`}>
          <h3 className="mt-2 font-semibold text-text hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="mt-1 text-sm text-text-muted line-clamp-2">{product.description}</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            ${(product.price / 100).toLocaleString()}
          </span>
          <span className={`text-xs ${inStock ? 'text-success' : 'text-danger'}`}>
            {inStock ? `${product.stock} uds.` : 'Sin stock'}
          </span>
        </div>

        <button
          onClick={() => addItem(product)}
          disabled={!inStock}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          <ShoppingCart size={16} />
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
