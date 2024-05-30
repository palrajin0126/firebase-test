"use client"
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase' // import firebase config
import Head from 'next/head';
import { useRouter } from 'next/navigation';

interface SignUpProps {
  onSignUp: (fullName: string, email: string, password: string) => void;
}

const SignUp = () => {
    const router = useRouter()
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Account created successfully!');
      router.push('/Signin')
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="flex justify-center p-4">
      <Head>
        <title>Sign Up</title>
      </Head>
      <form onSubmit={handleSubmit} className="w-full max-w-md p-4 bg-white rounded shadow md:px-24 md:py-8 sm:p-10 lg:p-12 xl:p-14">
        {error && (
          <div className="bg-red-200 border-l border-red-500 p-4 rounded text-sm text-red-700">
            {error}
          </div>
        )}
        <label className="block mb-2">
          <span className="text-gray-600">Full Name</span>
          <input
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="John Doe"
            className="w-full p-3 text-sm bg-white border-none rounded focus:shadow-outline focus:outline-none transition duration-300 ease-out"
          />
        </label>
        <label className="block mb-2">
          <span className="text-gray-600">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="example@example.com"
            className="w-full p-3 text-sm bg-white border-none rounded focus:shadow-outline focus:outline-none transition duration-300 ease-out"
          />
        </label>
        <label className="block mb-2">
          <span className="text-gray-600">Mobile</span>
          <input
            type="number"
            value={mobile}
            onChange={(event) => setMobile(event.target.value)}
            placeholder="+1 1234567890"
            className="w-full p-3 text-sm bg-white border-none rounded focus:shadow-outline focus:outline-none transition duration-300 ease-out"
          />
        </label>
        <label className="block mb-2">
          <span className="text-gray-600">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="*********"
            className="w-full p-3 text-sm bg-white border-none rounded focus:shadow-outline focus:outline-none transition duration-300 ease-out"
          />
        </label>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
