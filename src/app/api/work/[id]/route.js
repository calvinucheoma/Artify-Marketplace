import Work from '@/models/Work';
import { connectToDatabase } from '@/mongodb/database';
import { writeFile } from 'fs/promises';

export const GET = async (req, { params }) => {
  try {
    // Connect to MongoDB database
    await connectToDatabase();

    // Check if work exists from the params provided
    const work = await Work.findById(params.id).populate('creator');
    // 'id' is the name of our file (i.e [id])
    // we populate with the 'creator' because it is here we referenced the user of the work from the User model

    if (!work) {
      return new Response('Work not found', { status: 404 });
    }

    return new Response(JSON.stringify(work), { status: 200 });
  } catch (error) {
    return new Response(`Internal server error: ${error.message}`, {
      status: 500,
    });
  }
};

export const PATCH = async (req, { params }) => {
  try {
    await connectToDatabase();

    const data = await req.formData();

    // Extract info from the data
    const creator = data.get('creator');
    const category = data.get('category');
    const title = data.get('title');
    const description = data.get('description');
    const price = data.get('price');

    // Get an array of uploaded photos
    const photos = data.getAll('workPhotoPaths');

    const workPhotoPaths = [];

    // Process and store each photo
    for (const photo of photos) {
      // For new photos we added which would be in an object format
      if (photo instanceof Object) {
        // read the photo as an array buffer
        const bytes = await photo.arrayBuffer();

        // Convert it to a buffer
        const buffer = Buffer.from(bytes);

        // Define the destination path for the uploaded file
        const workImagePath = `C:/Users/ucheo/Documents/marketplace-nextjs-project/public/uploads/${photo.name}`;

        // Write the buffer to the files system
        await writeFile(workImagePath, buffer);

        // Store the file path in an array
        workPhotoPaths.push(`/uploads/${photo.name}`);
      } else {
        // For already existing images, we just push the photo as it is already transformed and stored as a url in our database
        workPhotoPaths.push(photo);
      }
    }

    const existingWork = await Work.findById(params.id);

    if (!existingWork) {
      return new Response('Work not found', { status: 404 });
    }

    //   Update the work with the new data
    existingWork.category = category;
    existingWork.title = title;
    existingWork.description = description;
    existingWork.price = price;
    existingWork.workPhotoPaths = workPhotoPaths;

    await existingWork.save();

    return new Response(JSON.stringify(existingWork), { status: 200 });
  } catch (error) {
    return new Response(`Error updating the work: ${error.message}`, {
      status: 500,
    });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    await connectToDatabase();

    const work = await Work.findById(params.id);

    if (!work) {
      return new Response('Work does not exist', { status: 404 });
    }

    await Work.findByIdAndDelete(params.id);

    return new Response('Work deleted successfully', { status: 200 });
  } catch (error) {
    return new Response(`Error deleting work: ${error.message}`, {
      status: 500,
    });
  }
};
