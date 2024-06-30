"use client";
import React from 'react';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import SignUp from '@/components/SignUp';
import Desktop from '@/components/Desktop';

export default function Page() {
  const [isClient, setIsClient] = useState(false);
  const [clientIsMobile, setClientIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setClientIsMobile(isMobile);
  }, []);

  return (
    <div>
      {isClient ? (clientIsMobile ? <SignUp /> : <Desktop />) : null}
    </div>
  );
}