'use client';
import '@/styles/Navbar.scss';
import { Menu, Person, Search, ShoppingCart } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Navbar = () => {
  const { data: session } = useSession();

  const user = session?.user;

  //   console.log(user);

  const cart = user?.cart;

  const router = useRouter();

  const [dropdownMenu, setDropdownMenu] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
    // when we log out, it leads us to the login page
  };

  const [query, setQuery] = useState('');

  const searchWork = async () => {
    router.push(`/search/${query}`);
  };

  return (
    <div className="navbar">
      <Link href="/">
        <img src="/assets/logo.png" alt="logo" />
      </Link>

      <div className="navbar_search">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <IconButton disabled={query === ''} onClick={searchWork}>
          <Search sx={{ color: 'red' }} />
        </IconButton>
      </div>

      <div className="navbar_right">
        {user && (
          <Link href="/cart" className="cart">
            <ShoppingCart sx={{ color: 'gray' }} /> Cart
            <span>({cart?.length})</span>
          </Link>
        )}
        <button
          className="navbar_right_account"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        >
          <Menu sx={{ color: 'gray' }} />
          {!user ? (
            <Person sx={{ color: 'gray' }} />
          ) : user.profileImagePath ? (
            <img
              src={user.profileImagePath}
              alt="Profile avatar"
              style={{ objectFit: 'cover', borderRadius: '50%' }}
            />
          ) : (
            <Person sx={{ color: 'green' }} />
          )}
        </button>

        {dropdownMenu && !user && (
          <div className="navbar_right_accountmenu">
            <Link href="/login">Log In</Link>
            <Link href="/register">Sign Up</Link>
          </div>
        )}

        {dropdownMenu && user && (
          <div className="navbar_right_accountmenu">
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/order">Order</Link>
            <Link href={`/shop?id=${user._id}`}>Your Shop</Link>
            <Link href="/create-work">Sell your work</Link>
            <a onClick={handleLogout}>Logout</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
