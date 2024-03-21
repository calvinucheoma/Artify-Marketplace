'use client';
import Navbar from '@/components/Navbar';
import getStripe from '@/lib/getStripe';
import '@/styles/Cart.scss';
import {
  AddCircle,
  ArrowCircleLeft,
  Delete,
  RemoveCircle,
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { data: session, update } = useSession();

  const [loading, setLoading] = useState(false);

  const cart = session?.user?.cart;

  const userId = session?.user?._id;

  /*    UPDATE CART   */

  const updateCart = async (cart) => {
    const response = await fetch(`/api/user/${userId}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart }),
    });
    const data = await response.json();
    update({ user: { cart: data } });
  };

  /*    CALCULATE CART SUBTOTAL  */

  const calculateSubtotal = (cart) => {
    return cart?.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
  };

  const subTotal = calculateSubtotal(cart);

  /*    INCREASE QUANTITY   */

  const increaseQuantity = (cartItem) => {
    const newCart = cart?.map((item) => {
      if (item === cartItem) {
        item.quantity += 1;
        return item;
      } else {
        return item;
      }
    });
    updateCart(newCart);
  };

  /*    DECREASE QUANTITY   */

  const decreaseQuantity = (cartItem) => {
    const newCart = cart?.map((item) => {
      if (item === cartItem && item.quantity > 1) {
        item.quantity -= 1;
        return item;
      } else {
        return item;
      }
    });
    updateCart(newCart);
  };

  /*    REMOVE FROM CART   */

  const removeFromCart = (cartItem) => {
    const newCart = cart?.filter((item) => item.workId !== cartItem.workId);
    updateCart(newCart);
  };

  /*    HANDLING CHECKOUT WITH STRIPE   */

  const handleCheckout = async () => {
    setLoading(true);
    const stripe = await getStripe();
    const response = await fetch(`/api/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cart, userId }),
    });

    if (response.statusCode === 500) {
      setLoading(false);
      return;
    }

    const data = await response.json();

    toast.loading('Redirecting to checkout...');

    const result = stripe.redirectToCheckout({ sessionId: data.id });

    setLoading(false);

    if (result.error) {
      console.log(result.error.message);
      toast.error('Something went wrong...');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="cart">
        <div className="details">
          <div className="top">
            <h1>Your Cart</h1>
            <h2>
              Subtotal: <span>₦{subTotal}</span>
            </h2>
          </div>

          {cart?.length === 0 && <h3>Empty Cart</h3>}

          {cart?.length > 0 && (
            <div className="all-items">
              {cart?.map((item, index) => (
                <div className="item" key={index}>
                  <div className="item_info">
                    <img src={item.image} alt="product" />
                    <div className="text">
                      <h3>{item.title}</h3>
                      <p>Category: {item.category}</p>
                      <p>Seller: {item.creator.username}</p>
                    </div>
                  </div>

                  <div className="quantity">
                    <RemoveCircle
                      sx={{
                        fontSize: '18px',
                        color: 'grey',
                        cursor: 'pointer',
                      }}
                      onClick={() => decreaseQuantity(item)}
                    />
                    <h3>{item.quantity}</h3>
                    <AddCircle
                      sx={{
                        fontSize: '18px',
                        color: 'grey',
                        cursor: 'pointer',
                      }}
                      onClick={() => increaseQuantity(item)}
                    />
                  </div>

                  <div className="price">
                    <h2>₦{item.quantity * item.price}</h2>
                    <p>₦{item.price} / each</p>
                  </div>

                  <div className="remove">
                    <Delete
                      sx={{ cursor: 'pointer' }}
                      onClick={() => removeFromCart(item)}
                    />
                  </div>
                </div>
              ))}

              <div className="bottom">
                <Link href="/">
                  <ArrowCircleLeft /> Continue shopping
                </Link>
                <button
                  onClick={handleCheckout}
                  style={{
                    opacity: !loading ? 1 : 0.5,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  CHECK OUT{' '}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;

/* 
        The 'reduce' method in JavaScript is used to "reduce" an array into a single value. It iterates over each 
        element of the array, performing a specified operation on each element, and accumulating the result into a
        single value.
    
        HOW IT WORKS
         • Starting Value: You provide an initial value, often called the "accumulator" or "initial accumulator," 
         which will hold the accumulated result.
         • Iteration: The 'reduce' method goes through each element of the array one by one.
         • Operation: For each element, you perform a specified operation (callback function) that takes two arguments:
            • Accumulator: This is the current accumulated value.
            • Current Value: This is the value of the current element being processed.
         • Accumulation: The result of each operation is accumulated into the accumulator.
         • Final Result: After iterating through all elements, the 'reduce' method returns the final accumulated result.
    
        EXAMPLE: To find the sum of all the elements in an array

            const numbers = [1, 2, 3, 4, 5];

            const sum = numbers.reduce((accumulator, currentValue) => {
            // Add the current value to the accumulator
            return accumulator + currentValue;
            }, 0); // Initial accumulator value is 0

            console.log(sum); // Output: 15 (1 + 2 + 3 + 4 + 5)

        EXAMPLE: To find the maximum value in an array

            const numbers = [5, 3, 8, 2, 9, 1];

            const maxNumber = numbers.reduce((max, currentValue) => {
            return currentValue > max ? currentValue : max;
            }, numbers[0]); // Initialize max with the first element of the array

            console.log("Maximum Number:", maxNumber);

        EXAMPLE: Counting the number of times each color appears in an array of colors

            const colors = ["red", "blue", "green", "red", "blue", "red", "yellow"];

            const colorCounts = colors.reduce((counts, color) => {
            // Check if the color already exists in the counts object
            // If it doesn't exist, initialize its count to 0
            // Then increment its count by 1
            counts[color] = (counts[color] || 0) + 1;
            return counts;
            }, {});
    
    */
