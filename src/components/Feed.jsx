'use client';
import '@/styles/Categories.scss';
import { categories } from '@/data';
import WorkList from './WorkList';
import { useEffect, useState } from 'react';
import Loader from './Loader';

const Feed = () => {
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('All');

  const [workList, setWorkList] = useState([]);

  // console.log(workList);

  const getWorkList = async () => {
    try {
      const response = await fetch(`/api/work/list/${selectedCategory}`);
      const data = await response.json();
      setWorkList(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorkList();
  }, [selectedCategory]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="categories">
        {categories?.map((category, index) => (
          <p
            key={index}
            onClick={() => setSelectedCategory(category)}
            className={`${category === selectedCategory ? 'selected' : ''}`}
          >
            {category}
          </p>
        ))}
      </div>

      <WorkList data={workList} />
    </>
  );
};

export default Feed;
