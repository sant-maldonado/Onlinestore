import { useState, useEffect } from 'react';
import { productsApi } from '../services/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { slug: '', name: 'Todas' },
  { slug: 'electronica', name: 'Electrónica' },
  { slug: 'ropa', name: 'Ropa' },
  { slug: 'hogar', name: 'Hogar' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productsApi
      .getAll(category || undefined)
      .then(({ data }) => setProducts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">Productos</h1>
        <p className="text-text-muted mt-1">Explora nuestro catálogo</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setCategory(cat.slug)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category === cat.slug
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-text-muted text-center py-12">No hay productos en esta categoría</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
