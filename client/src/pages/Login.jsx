import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

export default function Login() {
  const { user, login, register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: '', name: '', password: '' });

  if (user) return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(form.email, form.name, form.password);
      } else {
        await login(form.email, form.password);
      }
      navigate('/');
    } catch {}
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white border border-border rounded-xl p-8">
        <div className="text-center mb-6">
          {isRegister ? (
            <UserPlus size={40} className="mx-auto text-primary mb-2" />
          ) : (
            <LogIn size={40} className="mx-auto text-primary mb-2" />
          )}
          <h1 className="text-2xl font-bold text-text">
            {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 text-danger text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-text mb-1">Nombre</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Tu nombre"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Contraseña</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? 'Procesando...' : isRegister ? 'Crear cuenta' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-text-muted">
          {isRegister ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}{' '}
          <button
            onClick={() => { setIsRegister(!isRegister); setForm({ email: '', name: '', password: '' }); }}
            className="text-primary hover:underline"
          >
            {isRegister ? 'Iniciar sesión' : 'Registrarse'}
          </button>
        </div>
      </div>
    </div>
  );
}
