import { useState } from 'react';

export default function CheckoutForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    shippingAddress: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text mb-1">Dirección de envío</label>
        <input
          type="text"
          name="shippingAddress"
          required
          value={form.shippingAddress}
          onChange={handleChange}
          className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Calle y número"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1">Ciudad</label>
          <input
            type="text"
            name="city"
            required
            value={form.city}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Ciudad"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Provincia</label>
          <input
            type="text"
            name="state"
            required
            value={form.state}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Provincia"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1">Código Postal</label>
        <input
          type="text"
          name="zipCode"
          required
          value={form.zipCode}
          onChange={handleChange}
          className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="CP"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-secondary/90 disabled:opacity-50 transition-colors font-medium text-lg"
      >
        {loading ? 'Procesando...' : 'Pagar con Stripe'}
      </button>
    </form>
  );
}
