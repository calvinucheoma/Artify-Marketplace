import Work from '@/models/Work';
import { connectToDatabase } from '@/mongodb/database';

export const GET = async (req, { params }) => {
  try {
    await connectToDatabase();

    const { category } = params;

    let workList;

    if (category !== 'All') {
      workList = await Work.find({ category }).populate('creator');
    } else {
      workList = await Work.find().populate('creator');
    }

    return new Response(JSON.stringify(workList), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Failed to load work list category', { status: 500 });
  }
};
