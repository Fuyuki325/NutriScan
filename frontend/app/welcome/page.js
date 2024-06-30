"use client";
import React, { useState, useEffect } from 'react';
import Welcome from '@/components/Welcome';
import { isMobile } from 'react-device-detect';
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
      {isClient ? (clientIsMobile ? <Welcome /> : <Desktop />) : null}
    </div>
  );
}