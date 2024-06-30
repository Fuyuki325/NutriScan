import LongButton from '@/components/LongButton';
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link';

const SignUp = () => {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dietaryNeeds, setDietaryNeeds] = useState({
    vegan: false,
    vegetarian: false,
    halal: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: false,
  });
  const [error, setError] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setDietaryNeeds((prevNeeds) => ({
      ...prevNeeds,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://nutriscan-yogf.onrender.com/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          vegan: dietaryNeeds.vegan,
          vegetarian: dietaryNeeds.vegetarian,
          halal: dietaryNeeds.halal,
          glutenFree: dietaryNeeds.glutenFree,
          dairyFree: dietaryNeeds.dairyFree,
          nutFree: dietaryNeeds.nutFree,
        }),
      });

      if (!response.ok) {
        throw new Error('User already created');
      }

      const data = await response.json();
      // Assuming the API returns a token or some user data
      // Save token to localStorage or set user data in context/state
      // localStorage.setItem('token', data.token);

      // Redirect to the login page or another page
      router.push('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <title>Signup</title>
      <div className="font-Lato flex flex-col justify-center items-center h-screen">
        <div className="items-start text-headerBlue text-5xl text-left w-[85%]">SIGN UP</div>
        <p className="text-signupGray mt-6 text-left w-[85%]">
          Select the boxes that fit your dietary needs.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col items-center mt-4 w-5/6">
          <div className="flex flex-col mt-4 w-full">
            {Object.keys(dietaryNeeds).map((need) => (
              <label key={need} className="inline-flex items-center mb-4">
                <input
                  type="checkbox"
                  name={need}
                  checked={dietaryNeeds[need]}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <span className="ml-2 capitalize">{need.replace(/([A-Z])/g, ' $1')}</span>
              </label>
            ))}
          </div>
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
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <LongButton text="SIGN UP" />

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
  );
}

export default SignUp;