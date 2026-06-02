import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react';
import { productsApi } from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    productsApi
      .getById(id)
      .then(({ data }) => setProduct(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-100 rounded-xl h-96 animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Producto no encontrado</p>
        <Link to="/" className="text-primary hover:underline mt-2 inline-block">Volver</Link>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-text-muted hover:text-text mb-6">
        <ArrowLeft size={18} />
        Volver
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="h-80 md:h-96 bg-gray-100 rounded-xl flex items-center justify-center">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <span className="text-gray-400">Sin imagen</span>
          )}
        </div>

        <div>
          <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">
            {product.category?.name}
          </span>

          <h1 className="text-2xl md:text-3xl font-bold text-text mt-4">{product.name}</h1>

          <p className="text-3xl font-bold text-primary mt-4">
            ${(product.price / 100).toLocaleString()}
          </p>

          {product.description && (
            <p className="text-text-muted mt-4 leading-relaxed">{product.description}</p>
          )}

          <div className="mt-4">
            {inStock ? (
              <span className="text-success text-sm font-medium">En stock ({product.stock} unidades)</span>
            ) : (
              <span className="text-danger text-sm font-medium">Sin stock</span>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-text">Cantidad:</span>
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={() => { addItem(product, quantity); setQuantity(1); }}
              disabled={!inStock}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-lg"
            >
              <ShoppingCart size={20} />
              Agregar al carrito — ${((product.price * quantity) / 100).toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
