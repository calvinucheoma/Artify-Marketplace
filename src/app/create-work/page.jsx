'use client';
import Form from '@/components/Form';
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CreateWorkPage = () => {
  const { data: session } = useSession();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [work, setWork] = useState({
    creator: '',
    category: '',
    title: '',
    description: '',
    price: '',
    photos: [],
  });

  if (session) {
    work.creator = session?.user?._id;
  }

  const handleSubmit = async (e) => {
    setIsLoading(true);

    e.preventDefault();

    try {
      const newWorkForm = new FormData();
      // we need to use 'FormData' as our form has file uploads.
      // 'FormData' is a built-in JavaScript object that provides a way to easily construct a set of key-value pairs
      //  representing form fields and their values, which can then be sent in an HTTP request, typically with the 'fetch' API.
      // When you create a new 'FormData' object and log it to the console, you will see an empty object, as it starts as an empty container.

      for (var key in work) {
        newWorkForm.append(key, work[key]);
        //  the 'append' method is used to add key-value pairs to a 'FormData' object
        // The 'append' method is specifically designed for use with 'FormData' objects to add key-value pairs representing form fields and their values.
      }

      work.photos.forEach((photo) => {
        newWorkForm.append('workPhotoPaths', photo);
        // we add a new key 'workPhotoPaths' here to match with the one in our route
      });

      const response = await fetch('/api/work/new', {
        method: 'POST',
        body: newWorkForm,
      });

      if (response.ok) {
        router.push(`/shop?id=${session?.user?._id}`);
      }

      setIsLoading(false);
    } catch (error) {
      console.log('Publishing work failed', error.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Form
        type="Create"
        work={work}
        setWork={setWork}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
};

export default CreateWorkPage;
