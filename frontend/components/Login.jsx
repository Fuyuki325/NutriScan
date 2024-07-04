import React from 'react';
import { useState, useEffect } from 'react';
import LongButton from '@/components/LongButton';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import { useRouter } from 'next/navigation'

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      setCookie('sessionID', data.sessionID)
      setCookie('A', data.diet.A);
      setCookie('B', data.diet.B);
      setCookie('C', data.diet.C);
      setCookie('D', data.diet.D);
      setCookie('E', data.diet.E);
      setCookie('F', data.diet.F);
      router.push('/scan');
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Check if sessionID cookie exists
    const sessionID = document.cookie.split('; ').find(row => row.startsWith('sessionID='));
    if (sessionID) {
      router.push('/scan');
    } else {
      console.log('SessionID cookie not found');
    }
  }, []); // Empty dependency array to run this effect only once on component mount
  
  return (
    <>
      <title>Login</title>
      <h1 className="text-headerBlue font-Lato text-5xl w-199 h-77 mb-16 mt-12 ml-8">LOGIN</h1>
      <div className="flex flex-col items-center">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="w-5/6">
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className="border-b-2 border-inputGray focus:border-inputGray-200 w-full py-2 px-3 leading-tight focus:outline-none mb-6"
            placeholder="Email"
            required
          />
          <input 
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="border-b-2 border-inputGray focus:border-inputGray-200 w-full py-2 px-3 leading-tight focus:outline-none mb-6"
            placeholder="Password"
            required
          />
          <div className='flex flex-row justify-center'>
            {!loading ?<LongButton text="LOGIN" /> : <LongButton text="LOADING" />}
          </div>

          <div className='flex flex-row justify-center'>
            <Link
              href="/welcome"
              className="text-blue px-3 py-2 underline hover:opacity-75"
            >
              Go Back
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}

export default Login;