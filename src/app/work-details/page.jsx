'use client';
import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar';
import '@/styles/WorkDetails.scss';
import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Edit,
  Favorite,
  FavoriteBorder,
  ShoppingCart,
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const WorkDetailsPage = () => {
  const [loading, setLoading] = useState(true);
  const [work, setWork] = useState({});

  const searchParams = useSearchParams();

  const workId = searchParams.get('id');

  const router = useRouter();

  useEffect(() => {
    const getWorkDetails = async () => {
      const response = await fetch(`/api/work/${workId}`, {
        method: 'GET',
      });

      const data = await response.json();

      setWork(data);

      setLoading(false);
    };

    if (workId) {
      getWorkDetails();
    }
  }, [workId]);

  const { data: session, update } = useSession();

  const userId = session?.user?._id;

  // console.log(session);

  /*   PHOTO SLIDERS         */

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % work.workPhotoPaths.length
    );
  };

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + work.workPhotoPaths.length) %
        work.workPhotoPaths.length
    );
  };

  /*   SHOW MORE PHOTOS   */
  const [visiblePhotos, setVisiblePhotos] = useState(5);

  const loadMorePhotos = () => {
    setVisiblePhotos(work.workPhotoPaths.length);
    // Fetching all the images now
  };

  /*   SELECT SLIDER PHOTO TO SHOW  */
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  const handleSelectedPhoto = (index) => {
    setSelectedPhoto(index);
    setCurrentIndex(index);
  };

  /*    ADD WORK TO WISHLIST   */
  const wishlist = session?.user?.wishlist;

  const isLiked = wishlist?.find((item) => item._id === work._id);

  const patchWishList = async () => {
    const response = await fetch(`/api/user/${userId}/wishlist/${work._id}`, {
      method: 'PATCH',
    });
    const data = await response.json();
    update({ user: { wishlist: data.wishlist } });
    // using the 'update' function extracted from useSession to update the 'wishlist' array in the User model so that when we add
    // a work to our wishlist, it is updated immediately on the frontend by the change of the Favorite icon without us having
    // to refresh the page.
  };

  /*     ADD TO CART      */
  const cart = session?.user?.cart;

  const isInCart = cart?.find((item) => item?.workId === workId);

  const addToCart = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    const newCartItem = {
      workId,
      image: work.workPhotoPaths[0],
      title: work.title,
      category: work.category,
      creator: work.creator,
      price: work.price,
      quantity: 1,
    };

    if (!isInCart) {
      const newCart = [...cart, newCartItem];
      try {
        await fetch(`/api/user/${userId}/cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart: newCart }),
          /* 
            If you're sending a simple string, number, boolean, or array in the body of a fetch request, 
            you don't need to use JSON.stringify. The fetch API automatically handles these types of data and sends
            them in the appropriate format. However, if you're sending a JavaScript object in the body of the fetch
            request, you need to use JSON.stringify to convert the object into a string representation before 
            sending it. This ensures that the object is transmitted properly over the network.
          */

          /* 
            Even though 'newCart' is an array, it is still a JavaScript object because arrays are a type of object in
            JavaScript. Therefore, when you include 'newCart' in the body of the fetch request, you need to stringify
            it using JSON.stringify because fetch expects the body to be a string.
          */

          /* 
              However, if you're sending only string values (e.g., a single string, or an array of strings) in the
              body of your fetch request, you don't need to use JSON.stringify. You can simply include the string(s)
              directly in the body without any further processing.
            
              If you're sending objects or arrays of objects (even if they contain string, number, or other data types),
              you need to use JSON.stringify to convert them into a JSON-formatted string. This ensures that the 
              data is properly formatted for transmission over the network.
            */

          /*
              For number values, if you're sending them as standalone values (not part of an object or array), you
              don't need to use JSON.stringify. You can include the number directly in the body of the fetch request.
              However, if you're sending numbers as part of an object or array, you should use JSON.stringify to stringify
              the entire object or array, which includes the number value(s). This ensures that the entire data 
              structure is properly formatted as a JSON string for transmission.
            */

          /* 
            When using 'FormData' to send our forms, 'FormData' automatically handles the conversion of form data
            into a format suitable for transmission via HTTP requests, including handling file uploads. Therefore,
            you don't need to use JSON.stringify explicitly in this case.
            When using 'FormData', you can directly pass it as the body of the fetch request without needing to 
            stringify the data. This simplifies the process of sending form data, especially when dealing with file uploads.
            */
        });
        update({ user: { cart: newCart } }); //update the cart of the user in the session object
      } catch (error) {
        console.log(error.message);
      }
    } else {
      confirm('This item is already in your cart');
      return;
    }
  };

  // console.log(session?.user?.cart);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <div className="work-details">
        <div className="title">
          <h1>{work.title}</h1>

          {work?.creator?._id === userId ? (
            <div
              className="save"
              onClick={() => router.push(`/edit-work?id=${workId}`)}
            >
              <Edit />
              <p>Edit</p>
            </div>
          ) : (
            <div className="save" onClick={patchWishList}>
              {isLiked ? (
                <>
                  <Favorite sx={{ color: 'red' }} />
                  <p>Unsave</p>
                </>
              ) : (
                <>
                  <FavoriteBorder />
                  <p>Save</p>
                </>
              )}
            </div>
          )}
        </div>
        <div className="slider-container">
          <div
            className="slider"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {work.workPhotoPaths?.map((photo, index) => (
              <div className="slide" key={index}>
                <img src={photo} alt="work" />
                <div className="prev-button" onClick={(e) => goToPrevSlide(e)}>
                  <ArrowBackIosNew sx={{ fontSize: '15px' }} />
                </div>
                <div className="next-button" onClick={(e) => goToNextSlide(e)}>
                  <ArrowForwardIos sx={{ fontSize: '15px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="photos">
          {work.workPhotoPaths.slice(0, visiblePhotos).map((photo, index) => (
            <img
              src={photo}
              alt="work-demo"
              key={index}
              onClick={() => handleSelectedPhoto(index)}
              className={selectedPhoto === index ? 'selected' : ''}
            />
          ))}
          {visiblePhotos < work.workPhotoPaths.length && (
            <div className="show-more" onClick={loadMorePhotos}>
              <ArrowForwardIos sx={{ fontSize: '40px' }} />
              Show More
            </div>
          )}
        </div>

        <hr />

        <div className="profile">
          <img
            src={work.creator.profileImagePath}
            alt="profile"
            onClick={(e) => router.push(`/shop?id=${work.creator._id}`)}
          />
          <h3>Created by {work.creator.username}</h3>
        </div>

        <hr />

        <h3>About this product</h3>

        <p>{work.description}</p>

        <h1>₦{work.price}</h1>

        <button type="submit" onClick={addToCart}>
          <ShoppingCart />
          ADD TO CART
        </button>
      </div>
    </>
  );
};

export default WorkDetailsPage;
