'use client';
import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar';
import WorkList from '@/components/WorkList';
import '@/styles/Wishlist.scss';
import { useSession } from 'next-auth/react';

const WishlistPage = () => {
  const { data: session } = useSession();

  const wishlist = session?.user?.wishlist;

  return !session ? (
    <Loader />
  ) : (
    <>
      <Navbar />

      <h1 className="title-list">Your Wishlist</h1>

      <WorkList data={wishlist} />
    </>
  );
};

export default WishlistPage;
