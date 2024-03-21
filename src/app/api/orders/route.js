import User from '@/models/User';
import { connectToDatabase } from '@/mongodb/database';

const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

async function getCartItems(line_items) {
  return new Promise((resolve, reject) => {
    let cartItems = [];

    line_items?.data?.forEach(async (item) => {
      const product = await stripe.products.retrieve(item.price.product);
      const productId = product.metadata.productId;

      cartItems.push({
        productId,
        title: product.name,
        price: item.price.unit_amount_decimal / 100, // to convert it from kobo back to naira
        quantity: item.quantity,
        image: product.images[0],
      });

      if (cartItems.length === line_items?.data?.length) {
        resolve(cartItems);
      }
    });
  });
}

export const POST = async (req, res) => {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      // the session variable here would be equal to the session we created in the stripe route.

      const line_items = await stripe.checkout.sessions.listLineItems(
        event.data.object.id
      );
      // we would get all the items in the line_items array in our stripe route

      const orderItems = await getCartItems(line_items);

      const userId = session.client_reference_id; //same as in our stripe route

      const amountPaid = session.amount_total / 100;

      const orderData = {
        id: session.payment_intent,
        user: userId,
        orderItems,
        amountPaid,
      };

      await connectToDatabase();

      const user = await User.findById(userId);

      user.cart = [];

      user.orders.push(orderData);

      await user.save();

      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }
  } catch (error) {
    console.log(error.message);
    return new Response('Failed to create order', { status: 500 });
  }
};

// CLI command to get the Webhook key: stripe listen --events checkout.session.completed --forward-to localhost:3000/api/orders
