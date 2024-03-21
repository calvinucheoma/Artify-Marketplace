'use client';
import Form from '@/components/Form';
import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const EditWorkPage = () => {
  const [loading, setLoading] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const searchParams = useSearchParams();

  const workId = searchParams.get('id');

  const [work, setWork] = useState({
    category: '',
    title: '',
    description: '',
    price: '',
    photos: [],
  });

  useEffect(() => {
    const getWorkDetails = async () => {
      const response = await fetch(`/api/work/${workId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      setWork({
        category: data.category,
        title: data.title,
        description: data.description,
        price: data.price,
        photos: data.workPhotoPaths,
      });

      setLoading(false);
    };

    if (workId) {
      getWorkDetails();
    }
  }, [workId]);

  /*   HANDLING SUBMITTING FORM AFTER EDITING   */
  const handleSubmit = async (e) => {
    setIsLoading(true);

    e.preventDefault();

    try {
      const updateWorkForm = new FormData();

      for (var key in work) {
        updateWorkForm.append(key, work[key]);
      }

      work.photos.forEach((photo) => {
        updateWorkForm.append('workPhotoPaths', photo);
      });

      const response = await fetch(`/api/work/${workId}`, {
        method: 'PATCH',
        body: updateWorkForm,
      });

      if (response.ok) {
        router.push(`/shop?id=${session?.user?._id}`);
      }

      setIsLoading(false);
    } catch (error) {
      console.log('Editing work failed', error.message);
      setIsLoading(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <Form
        type="Edit"
        work={work}
        setWork={setWork}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
};

export default EditWorkPage;
