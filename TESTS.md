# OnlineStore — Tests

## Stack

| Capa          | Librería                                   |
| ------------- | ------------------------------------------ |
| **Server**    | Vitest + Supertest + Prisma mock           |
| **Client**    | Vitest + @testing-library/react + jsdom    |

---

## Cómo ejecutar los tests

### Servidor (Express + Prisma)

```bash
cd server

# Una vez (modo CI)
npm test

# Modo watch (se re-ejecutan al guardar cambios)
npm run test:watch
```

### Cliente (React + Vite)

```bash
cd client

# Una vez
npm test

# Modo watch
npm run test:watch
```

---

## Tests del Servidor (34 tests, 6 archivos)

### 1. `src/__tests__/middleware/authMiddleware.test.js` — 5 tests

Verifica el middleware de autenticación JWT:

- `should return 401 if no Authorization header`
- `should return 401 if Authorization does not start with Bearer`
- `should return 401 if token is invalid`
- `should call next() and set req.user for a valid token`
- `should detect admin role from token`

### 2. `src/__tests__/middleware/adminMiddleware.test.js` — 3 tests

Verifica el middleware de control de acceso por rol:

- `should return 403 if req.user is missing`
- `should return 403 if user role is not ADMIN`
- `should call next() if user role is ADMIN`

### 3. `src/__tests__/routes/auth.test.js` — 7 tests

Prueba los endpoints de autenticación:

- **POST /api/auth/register**
  - `should register a new user and return 201 with token`
  - `should return 400 if email is missing`
  - `should return 409 if email is already registered`
- **POST /api/auth/login**
  - `should login and return 200 with token`
  - `should return 401 if user does not exist`
  - `should return 401 if password is wrong`
  - `should return 400 if email is missing`

### 4. `src/__tests__/routes/products.test.js` — 5 tests

Prueba el catálogo de productos:

- **GET /api/products**
  - `should return all products`
  - `should filter by category slug`
  - `should return empty array when no products match`
- **GET /api/products/:id**
  - `should return a product by id`
  - `should return 404 if product not found`

### 5. `src/__tests__/routes/orders.test.js` — 3 tests

Prueba el acceso a órdenes del usuario autenticado:

- **GET /api/orders**
  - `should return 401 without auth token`
  - `should return user orders with valid token`
  - `should return empty array if user has no orders`

### 6. `src/__tests__/routes/admin.test.js` — 11 tests

Prueba el panel de administración con control de roles:

- **GET /api/admin/stats**
  - `should return 403 for non-admin users`
  - `should return stats for admin`
- **CRUD /api/admin/products**
  - `should list products`
  - `should create a product`
  - `should return 400 when creating without required fields`
  - `should update a product`
  - `should delete a product`
- **GET /api/admin/orders**
  - `should list all orders`
  - `should filter orders by status`
- **PUT /api/admin/orders/:id/status**
  - `should update order status`
  - `should return 400 for invalid status`

---

## Tests del Cliente (33 tests, 4 archivos)

### 1. `src/__tests__/CartContext.test.jsx` — 8 tests

Prueba el estado del carrito con Context + localStorage:

- `should start with empty cart`
- `should add item to cart`
- `should increase quantity when adding same item`
- `should add multiple different items`
- `should remove item from cart`
- `should update item quantity`
- `should clear cart`
- `should persist to localStorage`

### 2. `src/__tests__/AuthContext.test.jsx` — 5 tests

Prueba la autenticación (mocks de API):

- `should start with null user and token`
- `should login and set user and token`
- `should detect admin role after login`
- `should clear user and token on logout`
- `should set error on login failure`

### 3. `src/__tests__/ProductCard.test.jsx` — 11 tests

Prueba el componente de tarjeta de producto:

- `should render product name`
- `should render formatted price in dollars`
- `should render category name`
- `should show stock count when in stock`
- `should show "Sin stock" when stock is 0`
- `should disable add to cart button when out of stock`
- `should enable add to cart button when in stock`
- `should show "Sin imagen" placeholder when no image`
- `should have a link to product detail`
- `should show description`
- `should call addItem when clicking add to cart`

### 4. `src/__tests__/Navbar.test.jsx` — 9 tests

Prueba la barra de navegación con diferentes estados de auth:

- `should show brand name`
- `should show "Ingresar" button when user is not authenticated`
- `should show login link pointing to /login`
- `should show user name when authenticated`
- `should show logout button when authenticated`
- `should not show Admin link for regular users`
- `should show Admin link for admin users`
- `should show cart badge when items are in cart`
- `should not show cart badge when cart is empty`

---

## Resumen

```
Server: 34 passed · 6 test files
Client: 33 passed · 4 test files
Total:  67 passed · 10 test files
```
