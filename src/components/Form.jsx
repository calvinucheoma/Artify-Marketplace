import '@/styles/Form.scss';
import { categories } from '@/data';
import { IoIosImages } from 'react-icons/io';
import { BiTrash } from 'react-icons/bi';

const Form = ({ type, work, setWork, handleSubmit, isLoading }) => {
  const handlePhotosUpload = (e) => {
    const newPhotos = e.target.files;
    setWork((prevWork) => {
      return {
        ...prevWork,
        photos: [...prevWork.photos, ...newPhotos],
      };
    });
    // it's generally safer to use the functional form of 'setState' when updating state based on the previous state, as it ensures that you're always working with the most up-to-date state.
  };

  const removePhoto = (indexToRemove) => {
    setWork((prevWork) => {
      return {
        ...prevWork,
        photos: prevWork.photos.filter((_, index) => index !== indexToRemove),
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWork((prevWork) => {
      return {
        ...prevWork,
        [name]: value,
      };
    });
  };

  return (
    <div className="form">
      <h1>{type} Your Work</h1>
      <form onSubmit={handleSubmit}>
        <h3>Which of these categories best describe your work?</h3>
        <div className="category-list">
          {categories.map((category, index) => (
            <p
              key={index}
              className={`${work.category === category ? 'selected' : ''}`}
              onClick={() => setWork({ ...work, category: category })}
            >
              {category}
            </p>
          ))}
        </div>
        <h3>Upload some photos of your work</h3>
        {work.photos.length < 1 && (
          <div className="photos">
            <input
              type="file"
              style={{ display: 'none' }}
              id="image"
              accept="image/*"
              onChange={handlePhotosUpload}
              multiple
            />
            <label htmlFor="image" className="alone">
              <div className="icon">
                <IoIosImages />
              </div>
              <p>Upload from your device</p>
            </label>
          </div>
        )}

        {work.photos.length > 0 && (
          <div className="photos">
            {work?.photos?.map((photo, index) => (
              <div className="photo" key={index}>
                {photo instanceof Object ? (
                  <img src={URL.createObjectURL(photo)} alt="work" />
                ) : (
                  // we create the URL like this to display the photos when uploading
                  // This is when we are Creating our work
                  <img src={photo} alt="work" />
                  // after we store the photos in our database, they will be stored in a url form so we can just view them without creating a new URL.
                  // This for Editing our work
                )}
                <button type="button" onClick={() => removePhoto(index)}>
                  <BiTrash />
                </button>
              </div>
            ))}
            <input
              type="file"
              style={{ display: 'none' }}
              id="image"
              accept="image/*"
              onChange={handlePhotosUpload}
              multiple
            />
            <label htmlFor="image" className="together">
              <div className="icon">
                <IoIosImages />
              </div>
              <p>Upload from your device</p>
            </label>
          </div>
        )}

        <h3>Describe your work</h3>
        <div className="description">
          <p>Title</p>
          <input
            type="text"
            placeholder="Title"
            onChange={handleChange}
            name="title"
            value={work.title}
            required
          />
          <p>Description</p>
          <textarea
            placeholder="Description"
            onChange={handleChange}
            name="description"
            value={work.description}
            required
            style={{ resize: 'none' }}
          />
          <p>Set your price</p>
          <span>₦</span>
          <input
            type="number"
            placeholder="Price"
            name="price"
            value={work.price}
            onChange={handleChange}
            required
            className="price"
          />
        </div>

        <button
          type="submit"
          className="submit_btn"
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.5 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {type === 'Edit' ? 'EDIT YOUR WORK' : 'PUBLISH YOUR WORK'}
        </button>
      </form>
    </div>
  );
};

export default Form;
