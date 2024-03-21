import { connectToDatabase } from '@/mongodb/database';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { writeFile } from 'fs/promises';

// REGISTER USER
export async function POST(req) {
  try {
    // connect to mongodb database
    await connectToDatabase();

    const data = await req.formData();

    // get user information from the form
    const username = data.get('username');
    const email = data.get('email');
    const password = data.get('password');
    const file = data.get('profileImage');

    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    // buffer is a temporary storage area in computer memory that is used to hold data while it is being transferred from one place to another place.

    const buffer = Buffer.from(bytes);

    const profileImagePath = `C:/Users/ucheo/Documents/marketplace-nextjs-project/public/uploads/${file.name}`;
    // change all the slashes to forward slashes and not backward slashes else we get an error

    await writeFile(profileImagePath, buffer);

    console.log(`open ${profileImagePath} to see the uploaded file`);

    // check if the user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }

    // hash user password
    const saltRound = 10;
    const hashedPassword = await hash(password, saltRound);

    // create a new user if user does not exist
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profileImagePath: `/uploads/${file.name}`,
    });

    // save the new created user
    await newUser.save();

    // send a success message after user is created
    return NextResponse.json(
      { message: 'User registered successfully!', user: newUser },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Failed to create new user' },
      { status: 500 }
    );
  }
}
