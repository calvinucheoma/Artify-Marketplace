'use client';
import '@/styles/Register.scss';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

const RegisterPage = () => {
  const router = useRouter();

  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsPasswordMatch(formData.password === formData.confirmPassword);
  });

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
  });

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      // we use square brackets [name] around the variable 'name' (gotten from e.target) inside the object literal.
      // This tells JavaScript to use the value of the 'name' variable as the key for the property in the object.
      [name]: name === 'profileImage' ? files[0] : value,
    });
  };

  // console.log(formData);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const registerForm = new FormData();
      // we use 'FormData' because our form includes file uploads so we need to use it to ensure that the data is correctly formatted for the submissions.
      for (var key in formData) {
        registerForm.append(key, formData[key]);
      }

      const response = await fetch(`/api/register`, {
        method: 'POST',
        body: registerForm,
      });

      if (response.ok) {
        router.push('/login');
      }
      setIsLoading(false);
    } catch (error) {
      console.log('Registration failed', error.message);
      setIsLoading(false);
    }
  };

  const signInWithGoogle = () => {
    signIn('google', { callbackUrl: '/' });
    // after signing in, it takes us to the home page because of the callback url
  };

  return (
    <div className="register">
      <img
        src="/assets/register.jpg"
        alt="register banner"
        className="register_decor"
      />
      <div className="register_content">
        <form className="register_content_form" onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {!isPasswordMatch && (
            <p style={{ color: 'red' }}>Passwords do not match</p>
          )}
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            id="image"
            required
            style={{ display: 'none' }}
            onChange={handleChange}
          />
          <label htmlFor="image">
            <img src="/assets/addImage.png" alt="upload profile" />
            <p>Upload Profile Photo</p>
          </label>
          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="user profile pic"
              style={{ maxWidth: '80px' }}
            />
          )}
          <button
            type="submit"
            disabled={!isPasswordMatch}
            style={{
              opacity: isPasswordMatch || !isLoading ? 1 : 0.5,
              cursor: !isPasswordMatch || isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            Register
          </button>
        </form>
        <button type="button" className="google" onClick={signInWithGoogle}>
          <p>Log In With Google</p>
          <FcGoogle />
        </button>
        <Link href="/login">Already have an account? Log In Here</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
