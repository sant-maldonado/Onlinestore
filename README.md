 🛒 E-commerce — React + Node.js + Stripe

Tienda online fullstack con catálogo de productos, carrito, checkout con pagos reales (modo test) y panel de administración.

 🚀 Demo en vivo
[(https://onlinestore-ruby.vercel.app/)]

**Usuario cliente de prueba:**
Email: cliente@demo.com
Password: demo1234

Email: admin@store.com
Contraseña: Admin123

**Usuario admin de prueba:**
Email: admin@demo.com
Password: admin1234

Email: user@store.com
Contraseña: User123

**Tarjeta de prueba Stripe:**
Número: 4242 4242 4242 4242
Fecha: cualquier fecha futura · CVC: cualquier número

---

 ✨ Funcionalidades

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

 🛠 Stack

**Frontend:** React 18, React Router v6, Context API, Tailwind CSS, Stripe.js
**Backend:** Node.js, Express, Prisma ORM, JWT, Stripe SDK
**Base de datos:** PostgreSQL (Supabase)
**Imágenes:** Cloudinary
**Deploy:** Vercel (frontend) + Render (backend)

---

 ⚙️ Correr localmente

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

 📄 Variables de entorno

**Backend (.env)**
```
PORT=5001
DATABASE_URL="postgresql://postgres@localhost:5433/onlinestore"
JWT_SECRET="super-secret-key-change-in-production-123"
STRIPE_SECRET_KEY="sk_test_51TdxU3AVfIY8WqhFWABS20YZKWogEbniiPSpE6jftNAHAkdMBCc2ZKM9kuD5fQ3rdyINzydtkwksMJK12KLI1HOF0029skHqHT"
STRIPE_WEBHOOK_SECRET="whsec_placeholder"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51TdxU3AVfIY8WqhFrnTQmkjFEWbAotrQiaCvja84tKTzB7n2rKeWDkyZUA8xbNDpFjxUndReccPWvCbJfTPRB6j100ftw4Koin"
CLIENT_URL="http://localhost:5173"
CLOUDINARY_CLOUD_NAME="dsrtlwbgi"
CLOUDINARY_API_KEY="858732334769999"
CLOUDINARY_API_SECRET="74vm2y8R10TU_4-ecwy-ZzapVVg"

```

**Frontend (.env)**
```
VITE_API_URL= VITE_API_URL=http://localhost:5001/api
VITE_STRIPE_PUBLIC_KEY=
```

---

 📸 Capturas
<img width="1361" height="600" alt="Img1" src="https://github.com/user-attachments/assets/a1770ae3-30b0-44b6-b481-2a8ea1cfb5f0" />
<img width="1359" height="628" alt="Img2" src="https://github.com/user-attachments/assets/7b2111ef-ca5c-4dba-8435-e732f7308959" />
<img width="1359" height="626" alt="Img3" src="https://github.com/user-attachments/assets/cb9345d9-bb87-4a65-87e0-543fe53c3848" />
<img width="1361" height="630" alt="Img4" src="https://github.com/user-attachments/assets/dfe66394-3730-45ac-a4ce-23a6d5327933" />
<img width="1357" height="624" alt="Img5" src="https://github.com/user-attachments/assets/c6758bd0-04f0-4ef0-bd5f-6da89e8d3a2f" />





