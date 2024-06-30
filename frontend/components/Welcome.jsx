import React from 'react';
import Image from "next/image";
import Logo from "@/public/Nutrition Scanner-Private-PNG.png";
import Link from 'next/link';

const Welcome = () => {
  return (
    <>
    <title>Welcome!</title>
    <div className="flex flex-col justify-center items-center mt-32">
      <Image
        src={Logo}
        className="w-32 h-32"
        alt="Logo"
      />
      <h1 className="text-headerBlue font-Lato text-5xl font-bold mt-10 ">Welcome!</h1>
      <p className="text-welcomeGreen text-center text-base font-Lato w-48 mt-1">
      We will help you find out if your food fits your diet!
      </p>
      <div className="flex flex-row mt-6 gap-2">
        <Link
          href="/login"
          className="bg-darkblue text-white font-Lato py-2 px-6 rounded-lg hover:bg-darkblue-200"
          > 
            LOGIN
        </Link>
        <Link
          href="/signup"
          className="bg-darkblue text-white font-Lato py-2 px-6 rounded-lg hover:bg-darkblue-200"
          > 
        SIGNUP
        </Link>
      </div>
    </div>
  </> 
  )
}

export default Welcome;