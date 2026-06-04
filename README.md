# 🛒 E-commerce — React + Node.js + Stripe

Tienda online fullstack con catálogo de productos, carrito, checkout con pagos reales (modo test) y panel de administración.

## 🚀 Demo en vivo
[Ver tienda →](TU_LINK_VERCEL)

**Usuario cliente de prueba:**
Email: cliente@demo.com
Password: demo1234

**Usuario admin de prueba:**
Email: admin@demo.com
Password: admin1234

**Tarjeta de prueba Stripe:**
Número: 4242 4242 4242 4242
Fecha: cualquier fecha futura · CVC: cualquier número

---

## ✨ Funcionalidades

**Tienda**
- Catálogo con búsqueda y filtro por categoría
- Página de detalle de producto
- Carrito persistente con cantidades editables
- Checkout con Stripe Elements (modo test)
- Historial de órdenes del usuario

**Panel admin**
- CRUD completo de productos con upload de imágenes
- Listado de órdenes con estado (pendiente / pagado / enviado)
- Gestión de stock automática al confirmar pago

---

## 🛠 Stack

**Frontend:** React 18, React Router v6, Context API, Tailwind CSS, Stripe.js
**Backend:** Node.js, Express, Prisma ORM, JWT, Stripe SDK
**Base de datos:** PostgreSQL (Supabase)
**Imágenes:** Cloudinary
**Deploy:** Vercel (frontend) + Render (backend)

---

## ⚙️ Correr localmente

```bash
# Clonar el repo
git clone https://github.com/TU_USUARIO/ecommerce-app

# Backend
cd server
npm install
cp .env.example .env   # completar variables
npx prisma migrate dev
npm run dev

# Frontend
cd client
npm install
npm run dev
```

---

## 📄 Variables de entorno

**Backend (.env)**
```
DATABASE_URL=
JWT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=3001
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:3001
VITE_STRIPE_PUBLIC_KEY=
```

---

## 📸 Capturas
<!-- Agregar capturas acá -->
