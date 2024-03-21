import User from '@/models/User';
import Work from '@/models/Work';
import { connectToDatabase } from '@/mongodb/database';

export const GET = async (req, { params }) => {
  try {
    await connectToDatabase();

    const user = await User.findById(params.id);

    const workList = await Work.find({ creator: params.id }).populate(
      'creator'
    );

    user.works = workList;

    await user.save();

    return new Response(JSON.stringify({ user, workList }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Failed to fetch work list by user', { status: 500 });
  }
};
