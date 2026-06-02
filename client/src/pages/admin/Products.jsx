import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/api';
import AdminProductForm from '../../components/AdminProductForm';

export default function Products() {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = () => {
    adminApi.getProducts().then(({ data }) => setProducts(data)).catch(() => {});
    adminApi.getCategories().then(({ data }) => setCategories(data)).catch(() => {});
  };

  useEffect(load, []);

  if (!user || !isAdmin) return <Navigate to="/" />;

  const handleCreate = async (data) => {
    setLoading(true);
    try {
      await adminApi.createProduct(data);
      setShowForm(false);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al crear');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      await adminApi.updateProduct(editing.id, data);
      setEditing(null);
      setShowForm(false);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await adminApi.deleteProduct(id);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Productos</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(!showForm); }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cerrar' : 'Nuevo producto'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? 'Editar producto' : 'Nuevo producto'}</h2>
          <AdminProductForm
            initial={editing}
            categories={categories}
            onSubmit={editing ? handleUpdate : handleCreate}
            loading={loading}
          />
        </div>
      )}

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="text-left p-3 font-medium text-text-muted">Producto</th>
                <th className="text-left p-3 font-medium text-text-muted">Categoría</th>
                <th className="text-right p-3 font-medium text-text-muted">Precio</th>
                <th className="text-right p-3 font-medium text-text-muted">Stock</th>
                <th className="text-right p-3 font-medium text-text-muted">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs shrink-0">
                        {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover rounded" /> : 'Img'}
                      </div>
                      <span className="font-medium text-text">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-text-muted">{p.category?.name}</td>
                  <td className="p-3 text-right font-medium">${(p.price / 100).toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${p.stock > 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => { setEditing(p); setShowForm(true); }}
                        className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-text-muted hover:text-danger hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <p className="p-6 text-center text-text-muted">No hay productos</p>
        )}
      </div>
    </div>
  );
}
