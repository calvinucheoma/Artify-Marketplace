import Work from '@/models/Work';
import { connectToDatabase } from '@/mongodb/database';
import { writeFile } from 'fs/promises';

export async function POST(req) {
  try {
    // Connect to MongoDB
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
    }

    // 'for...of' loops can only be used with iterable objects like arrays, strings, maps, and sets.
    //  On the other hand, forEach can only be used with arrays.
    //  In a for...of loop, you can use break and continue statements to control the loop flow.
    //  However, in a forEach loop, you cannot directly use break or continue to interrupt the loop.

    // Create a new work
    const newWork = new Work({
      creator,
      category,
      title,
      description,
      price,
      workPhotoPaths,
    });

    await newWork.save();

    return new Response(JSON.stringify(newWork), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Failed to create a new work', { status: 500 });
  }
}

/*
The 'getAll' method of the 'FormData' object retrieves all the values associated with a specific key as an array. 
This is particularly useful when dealing with form inputs that allow multiple selections, such as file uploads, 
checkboxes, or select elements with the 'multiple' attribute.

On the other hand, the 'get' method retrieves the first value associated with a specific key. 
If multiple values are associated with the key, it returns only the first one. 
This is suitable for form inputs that expect a single value, such as text inputs or radio buttons.

So, in the provided code snippet, 'getAll('workPhotoPaths')' would retrieve all the file paths uploaded for the 
key 'workPhotoPaths', storing them as an array in the photos variable.

*/
