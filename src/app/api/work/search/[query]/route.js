import Work from '@/models/Work';
import { connectToDatabase } from '@/mongodb/database';

export const GET = async (req, { params }) => {
  try {
    await connectToDatabase();

    const { query } = params;

    let works = [];

    if (query === 'all') {
      works = await Work.find().populate('creator');
    } else {
      works = await Work.find({
        $or: [
          { category: { $regex: query, $options: 'i' } },
          { title: { $regex: query, $options: 'i' } },
          // The 'i' option here is to make it case-insensitive
          // The 'or' operator makes sure it matches one of 'category' or 'title'
        ],
      }).populate('creator');
    }

    if (!works) return new Response('No work found', { status: 404 });

    return new Response(JSON.stringify(works), { status: 200 });
  } catch (error) {
    console.log(error.message);
    return new Response('Failed to fetch work', { status: 500 });
  }
};
