import Stripe from 'stripe';
import prisma from '../prisma/prisma.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(req, res, next) {
  try {
    const { items, shippingAddress, city, state, zipCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const productIds = items.map(item => item.id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map(p => [p.id, p]));

    const lineItems = items.map(item => {
      const product = productMap.get(item.id);
      if (!product) throw new Error(`Product ${item.id} not found`);
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      return {
        price_data: {
          currency: 'ars',
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [],
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      };
    });

    const total = lineItems.reduce((sum, li) => sum + li.price_data.unit_amount * li.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total,
        shippingAddress,
        city,
        state,
        zipCode,
        items: {
          create: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: productMap.get(item.id).price,
          })),
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/orden-exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/carrito`,
      metadata: { orderId: order.id },
    });

    res.json({ url: session.url, sessionId: session.id, orderId: order.id });
  } catch (err) {
    next(err);
  }
}

export async function handleWebhook(req, res, next) {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
        stripePaymentIntent: session.payment_intent,
      },
      include: { items: true },
    });

    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
  }

  res.json({ received: true });
}
