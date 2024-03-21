'use client';
import '@/styles/WorkCard.scss';
import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Delete,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const WorkCard = ({ work }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const router = useRouter();

  const { data: session, update } = useSession();

  const userId = session?.user?._id;

  /*     SLIDER FOR PHOTOS     */

  const goToNextSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % work.workPhotoPaths.length
    );
    /*
      The % (modulo) operator is used to ensure that the index wraps around to 0 when it reaches the end of the 
      array of slides (work.workPhotoPath.length). This prevents the index from exceeding the bounds of the array.
      For example, 1 % 4 = 1; 2 % 4 = 2; 3 % 4 = 3 and 4 % 4 = 0 so if our array has a length of 4, when it reaches
      the end, it goes back to 0, which is the first picture.
      Recall that modulo is the remainder after dividing one number by another.
    */
  };

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + work.workPhotoPaths.length) %
        work.workPhotoPaths.length
    );
    /*
      Adding work.workPhotoPath.length to (prevIndex - 1) ensures that the result is always a positive value, 
      which prevents negative indices when wrapping around to the end of the array.
    */
  };

  /*   DELETE WORK    */
  const handleDelete = async () => {
    const hasConfirmed = confirm('Are you sure you want to delete this work?');

    if (hasConfirmed) {
      try {
        await fetch(`/api/work/${work._id}`, {
          method: 'DELETE',
        });
        window.location.reload();
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  /*    ADD WORK TO WISHLIST   */
  const wishlist = session?.user?.wishlist;

  const isLiked = wishlist?.find((item) => item._id === work._id);

  const patchWishList = async () => {
    if (!session) {
      router.push('/login');
      return;
    }
    const response = await fetch(`/api/user/${userId}/wishlist/${work._id}`, {
      method: 'PATCH',
    });
    const data = await response.json();
    update({ user: { wishlist: data.wishlist } });
    // using the 'update' function extracted from useSession to update the 'wishlist' array in the User model so that when we add
    // a work to our wishlist, it is updated immediately on the frontend by the change of the Favorite icon without us having
    // to refresh the page.
  };

  return (
    <div
      className="work-card"
      onClick={() => {
        router.push(`/work-details?id=${work._id}`);
      }}
    >
      <div className="slider-container">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {work.workPhotoPaths?.map((photo, index) => (
            <div className="slide" key={index}>
              <img src={photo} alt="work" />
              <div
                className="prev-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevSlide(e);
                }}
              >
                <ArrowBackIosNew sx={{ fontSize: '15px' }} />
              </div>
              <div
                className="next-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextSlide(e);
                }}
              >
                <ArrowForwardIos sx={{ fontSize: '15px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="info">
        <div>
          <h3>{work.title}</h3>
          <div className="creator">
            <img src={work.creator.profileImagePath} alt="creator" />
            <span>{work.creator.username}</span> in <span>{work.category}</span>
          </div>
        </div>
        <div className="price">₦{work.price}</div>
      </div>

      {userId === work?.creator._id ? (
        <div
          className="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <Delete
            sx={{
              borderRadius: '50%',
              backgroundColor: 'white',
              padding: '5px',
              fontSize: '30px',
            }}
          />
        </div>
      ) : (
        <div
          className="icon"
          onClick={(e) => {
            e.stopPropagation();
            patchWishList();
          }}
        >
          {isLiked ? (
            <Favorite
              sx={{
                borderRadius: '50%',
                backgroundColor: 'white',
                color: 'red',
                padding: '5px',
                fontSize: '30px',
              }}
            />
          ) : (
            <FavoriteBorder
              sx={{
                borderRadius: '50%',
                backgroundColor: 'white',
                padding: '5px',
                fontSize: '30px',
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default WorkCard;

/*
  If we do not have e.stopPropagation(), when we click on the 'delete' or 'like' buttons, it would take us to the
  'work-details' page since we set the whole card to take us to the 'work-details' page when clicked.

  'e.stopPropagation()' is a method available on the 'Event' object in JavaScript.
  When called, it prevents the event from propagating further through the DOM. 
  In other words, it stops the event from bubbling up the DOM tree.
  This is particularly useful in scenarios where you have nested elements with event listeners, 
  and you want to prevent the parent elements' event handlers from being triggered when a child element is clicked.
  In this case, e.stopPropagation() ensures that only the event handler associated with the specific 
  button (either previous or next) is executed when it's clicked, without triggering any event handlers associated with its parent or ancestor elements.

  So, by calling e.stopPropagation() within the arrow functions for the previous and next buttons, 
  the author ensures that clicking on these buttons doesn't trigger any other event handlers that might be 
  attached to their parent or ancestor elements, maintaining the intended behavior of the slider navigation.

*/
