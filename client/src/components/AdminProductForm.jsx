import { useState, useEffect, useRef } from 'react';
import { adminApi } from '../services/api';

export default function AdminProductForm({ initial, categories, onSubmit, loading }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    stock: '',
    categoryId: '',
  });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || '',
        description: initial.description || '',
        price: String(initial.price || ''),
        image: initial.image || '',
        stock: String(initial.stock ?? ''),
        categoryId: initial.categoryId || (categories[0]?.id || ''),
      });
    } else {
      setForm({
        name: '',
        description: '',
        price: '',
        image: '',
        stock: '',
        categoryId: categories[0]?.id || '',
      });
    }
  }, [initial, categories]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await adminApi.uploadImage(file);
      setForm({ ...form, image: data.url });
    } catch (err) {
      alert('Error al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: Math.round(parseFloat(form.price) * 100),
      stock: parseInt(form.stock) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Precio ($)</label>
          <input
            type="number"
            step="0.01"
            required
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            type="number"
            required
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Imagen</label>
        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          onChange={handleUpload}
          className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary-dark"
        />
        {uploading && <p className="text-sm text-muted-foreground mt-1">Subiendo imagen...</p>}
        {form.image && (
          <img src={form.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg border" />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Categoría</label>
        <select
          value={form.categoryId}
          onChange={e => setForm({ ...form, categoryId: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={loading || uploading}
        className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
      >
        {loading ? 'Guardando...' : initial ? 'Actualizar producto' : 'Crear producto'}
      </button>
    </form>
  );
}
