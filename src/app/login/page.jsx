'use client';
import '@/styles/login.scss';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const response = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (response.ok) {
        router.push('/');
      }

      if (response.error) {
        setError('Something went wrong. Please try again');
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const signInWithGoogle = () => {
    signIn('google', { callbackUrl: '/' });
    // after signing in, it takes us to the home page because of the callback url
  };

  return (
    <div className="login">
      <img src="/assets/login.jpg" alt="login" className="login_decor" />
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button
            type="submit"
            style={{
              opacity: !isLoading ? 1 : 0.5,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            Log In
          </button>
        </form>
        <button className="google" type="button" onClick={signInWithGoogle}>
          <p>Log In with Google</p>
          <FcGoogle />
        </button>
        <Link href="/register">Don't have an account? Sign Up Here</Link>
      </div>
    </div>
  );
};

export default LoginPage;
