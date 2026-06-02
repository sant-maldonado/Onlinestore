import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

async function uploadToCloudinary(url, name) {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: 'online-store',
      public_id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    });
    return result.secure_url;
  } catch {
    return url;
  }
}

async function main() {
  const adminPassword = await bcrypt.hash('Admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@store.com' },
    update: {},
    create: {
      email: 'admin@store.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const userPassword = await bcrypt.hash('User123', 10);

  await prisma.user.upsert({
    where: { email: 'user@store.com' },
    update: {},
    create: {
      email: 'user@store.com',
      name: 'Test User',
      password: userPassword,
      role: 'USER',
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronica' },
      update: {},
      create: { name: 'Electrónica', slug: 'electronica' },
    }),
    prisma.category.upsert({
      where: { slug: 'ropa' },
      update: {},
      create: { name: 'Ropa y Accesorios', slug: 'ropa' },
    }),
    prisma.category.upsert({
      where: { slug: 'hogar' },
      update: {},
      create: { name: 'Hogar y Deco', slug: 'hogar' },
    }),
  ]);

  const productsData = [
    { name: 'Auriculares Bluetooth Pro', description: 'Auriculares inalámbricos con cancelación de ruido activa y 30h de batería.', price: 8999, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', stock: 25, categorySlug: 'electronica' },
    { name: 'Smartwatch Deportivo', description: 'Reloj inteligente con GPS, monitor cardíaco y resistencia al agua IP68.', price: 15999, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', stock: 15, categorySlug: 'electronica' },
    { name: 'Cámara DSLR 4K', description: 'Cámara réflex digital con grabación 4K y lente intercambiable de 18-55mm.', price: 45999, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop', stock: 8, categorySlug: 'electronica' },
    { name: 'Remera Algodón Premium', description: 'Remera de algodón orgánico de 220g/m², corte moderno y cómodo.', price: 2999, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', stock: 50, categorySlug: 'ropa' },
    { name: 'Zapatillas Urbanas', description: 'Zapatillas livianas con suela amortiguada y diseño urbano minimalista.', price: 12999, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', stock: 20, categorySlug: 'ropa' },
    { name: 'Mochila Viajera 40L', description: 'Mochila ergonómica con compartimento para notebook y anti-robo.', price: 6999, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', stock: 30, categorySlug: 'ropa' },
    { name: 'Lámpara LED Smart', description: 'Lámpara de mesa LED regulable con WiFi, compatible con Alexa y Google Home.', price: 4999, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', stock: 18, categorySlug: 'hogar' },
    { name: 'Set Sartenes Antiadherentes', description: 'Juego de 3 sartenes de cerámica antiadherente con tapas de vidrio.', price: 7999, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', stock: 12, categorySlug: 'hogar' },
    { name: 'Organizador Modular', description: 'Sistema de organización modular con 6 compartimentos apilables.', price: 3499, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', stock: 22, categorySlug: 'hogar' },
  ];

  for (const p of productsData) {
    const category = categories.find(c => c.slug === p.categorySlug);
    const image = await uploadToCloudinary(p.image, p.name);
    await prisma.product.upsert({
      where: { id: p.name },
      update: { image, description: p.description, price: p.price, stock: p.stock },
      create: {
        id: p.name,
        name: p.name,
        description: p.description,
        price: p.price,
        image,
        stock: p.stock,
        categoryId: category.id,
      },
    });
  }

  console.log('Seed completed successfully');
  console.log(`Admin: admin@store.com / Admin123`);
  console.log(`User:  user@store.com / User123`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
