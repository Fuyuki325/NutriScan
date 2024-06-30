"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import LongButton from '@/components/LongButton';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import Login from '@/components/Login';
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
      {isClient ? (clientIsMobile ? <Login /> : <Desktop />) : null}
    </div>
  );
}