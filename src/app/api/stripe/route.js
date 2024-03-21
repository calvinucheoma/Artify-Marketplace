import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export const POST = async (req, res) => {
  if (req.method === 'POST') {
    const { cart, userId } = await req.json();
    try {
      const lineItems = cart?.map((item) => {
        return {
          price_data: {
            currency: 'ngn',
            product_data: {
              name: item.title,
              images: [`${req.headers.get('origin')}/${item.image}`],
              metadata: {
                productId: item.workId, //if you want to set the name yourself
              },
            },
            unit_amount: Number(item.price) * 100, //all need to be in cents/kobo
          },
          quantity: Number(item.quantity),
        };
      });

      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        shipping_options: [
          { shipping_rate: 'shr_1OwVsYJeZGxkLwNhuhtCzJLD' },
          { shipping_rate: 'shr_1OwQxNJeZGxkLwNhPe9Q9etI' },
        ],
        line_items: lineItems,
        client_reference_id: userId, //if you want to set the name yourself
        mode: 'payment',
        success_url: `${req.headers.get('origin')}/success`,
        cancel_url: `${req.headers.get('origin')}/canceled`,
      };
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);
      return new Response(JSON.stringify(session), { status: 200 });
    } catch (err) {
      console.log(err.message);
      return new Response('Error processing payment', { status: 500 });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};
