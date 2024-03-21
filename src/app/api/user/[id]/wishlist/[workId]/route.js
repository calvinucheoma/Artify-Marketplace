import User from '@/models/User';
import Work from '@/models/Work';
import { connectToDatabase } from '@/mongodb/database';

export const PATCH = async (req, { params }) => {
  try {
    await connectToDatabase();

    const userId = params.id; // 'id' is from the folder name inside the 'user' folder
    const workId = params.workId;

    const user = await User.findById(userId);
    const work = await Work.findById(workId).populate('creator');

    if (!user) {
      return new Response('UserId does not exist', { status: 404 });
    }

    if (!work) {
      return new Response('WorkId does not exist', { status: 404 });
    }

    const favoriteWork = user.wishlist.find(
      (item) => item._id.toString() === workId
    );

    if (favoriteWork) {
      user.wishlist = user.wishlist.filter(
        (item) => item._id.toString() !== workId
      );
      await user.save();

      return new Response(
        JSON.stringify({
          message: 'Work removed from wishlist',
          wishlist: user.wishlist,
        }),
        { status: 200 }
      );
    } else {
      user.wishlist.push(work);
      await user.save();

      return new Response(
        JSON.stringify({
          message: 'Work added to wishlist',
          wishlist: user.wishlist,
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error.message);
    return new Response('Failed to patch work to wishlist', { status: 500 });
  }
};
