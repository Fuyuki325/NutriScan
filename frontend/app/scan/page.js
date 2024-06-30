'use client'
import Image from "next/image";
import Logo from "@/public/Nutrition Scanner-Private-PNG.png"
import LongButton from "@/components/LongButton";
import Webcam from 'react-webcam';
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { isMobile } from 'react-device-detect';
import Desktop from "@/components/Desktop";
import { useRouter } from 'next/navigation'

export default function scanPage() {
  const router = useRouter();

  const [showLogout, setShowLogout] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [scanButton, setScanButton] = useState(true);
  const [captureButton, setCaptureButton] = useState(false);
  const [rescan, setRescan] = useState(false);
  const [resultPage, setResultPage] = useState(false);
  const [safeToConsume, setSafeToConsume] = useState(false);

  const [sessionID, setSessionID] = useState(null);


  const [isClient, setIsClient] = useState(false);
  const [clientIsMobile, setClientIsMobile] = useState(false);

  const [error, setError] = useState(null);

  const [claudeMessage, setClaudeMessage] = useState('');

  useEffect(() => {
    setIsClient(true);
    setClientIsMobile(isMobile);
  }, []);

  // When pressed on TS button, logout drops down.
  const handleTSClick = () => {
    setShowLogout(!showLogout);
  };

  const handleLogOut = () => {
    delete_cookie('sessionID')
    delete_cookie('A')
    delete_cookie('B')
    delete_cookie('C')
    delete_cookie('D')
    delete_cookie('E')
    delete_cookie('F')
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function get_cookie(name){
    return document.cookie.split(';').some(c => {
        return c.trim().startsWith(name + '=');
    });
  }

  function delete_cookie( name, path, domain ) {
    if (get_cookie(name)) {
      document.cookie = `${name}=; path=${path}; domain=${domain ? domain : ''}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    setSessionID(null);
  }

  
  const handleScanClick = () => {
    setOpenCamera(true);
    setScanButton(false);

    // timeout
    setTimeout(() => {
      setCaptureButton(true);
      console.log('setcapturebutton ran')
    }, 2000);
  };
 
  const handleCancelClick = () => {
    setOpenCamera(false);
    setCapturedImage(null);
    setScanButton(true);
  };

  const handleRescanClick = () => {
    setOpenCamera(true);
    setCapturedImage(null);
    setRescan(false);
  };

  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  const handleSubmitClick = async(e) => {
    setProcessing(true); // processing(API) starts
    setRescan(false); // No Rescan & Submit button

    console.log('api called');
    console.log('Image format for lin:', capturedImage);
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3001/scan', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({
          image: capturedImage
        }),
      });

      if (!response.ok) {
        throw new Error('Scan failed');
      }

      const data = await response.json();
      console.log('array:', data.options);
      const arr = data.options;
      console.log('A', getCookie('A'));
      console.log('B', getCookie('B'));
      if (getCookie('A') && !arr.includes("A")) {
        setSafeToConsume(false);
        setClaudeMessage('This product is not suitable for vegans.')
        setProcessing(false); // processing is done
        setResultPage(true); // show result page
        setCapturedImage(null); // discard image
        return;
      }
      if (getCookie('B') && !arr.includes("B")) {
        setSafeToConsume(false);
        setClaudeMessage('This product is not suitable for vegetarians.')
        setProcessing(false); // processing is done
        setResultPage(true); // show result page
        setCapturedImage(null); // discard image
        return;
      }
      if (getCookie('C') && !arr.includes("C")) {
        setSafeToConsume(false);
        setClaudeMessage('This product is not halal.')
        setProcessing(false); // processing is done
        setResultPage(true); // show result page
        setCapturedImage(null); // discard image
        return;
      }
      if (getCookie('D') && !arr.includes("D")) {
        setSafeToConsume(false);
        setClaudeMessage('This product is not gluten-free.')
        setProcessing(false); // processing is done
        setResultPage(true); // show result page
        setCapturedImage(null); // discard image
        return;
      }
      if (getCookie('E') && !arr.includes("E")) {
        setSafeToConsume(false);
        setClaudeMessage('This product is not dairy-free.')
        setProcessing(false); // processing is done
        setResultPage(true); // show result page
        setCapturedImage(null); // discard image
        return;
      }
      if (getCookie('F') && !arr.includes("F")) {
        setSafeToConsume(false);
        setClaudeMessage('This product is not nut-free.')
        setProcessing(false); // processing is done
        setResultPage(true); // show result page
        setCapturedImage(null); // discard image
        return;
      }

      setSafeToConsume(true); // Safe to consume
      setClaudeMessage('This product is suitable for you based on your dietary preferences.')
      setProcessing(false); // processing is done
      setResultPage(true); // show result page
      setCapturedImage(null); // discard image
      

    } catch (error) {
      setError(error.message);
    }

    console.log('api finished');

    setProcessing(false); // processing is done
    setResultPage(true); // show result page
    setCapturedImage(null); // discard image
  };

  const handleBackButton = () => {
    setResultPage(false);
    setScanButton(true);
  };

  useEffect(() => {
    // Check if sessionID cookie exists
    const sessionID = document.cookie.split('; ').find(row => row.startsWith('sessionID='));
    setSessionID(sessionID);
    if (sessionID) {
    } else {
      router.push('/welcome');
    }
  }, [sessionID]);



  
  const videoConstraints = {
    width: 1080,
    height: 1920,
    facingMode: 'user'
  };

  const WebcamCapture = ({openCamera, setCapturedImage, setOpenCamera, setProcessing}) => {
    const webcamRef = React.useRef(null);
    const capture = React.useCallback(() => {
        if (webcamRef.current){
          const imageSrc = webcamRef.current.getScreenshot();
          if (!imageSrc) return;
          setCapturedImage(imageSrc);
          setOpenCamera(false);
          setRescan(true);
        }
    }, [webcamRef, setCapturedImage, setOpenCamera, setProcessing]);
   
    return (
      <>
      {openCamera && (
        <>
          <Webcam
            audio={false}
            height={350}
            width={350}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
          {captureButton && <LongButton text="CAPTURE" onClick={capture} />}
          <LongButton text="CANCEL" onClick={handleCancelClick} />
        </>
      )}
    </>
  );
};

  return (
    <>
      {isClient ? (clientIsMobile ?
        <>
        <title>Scan</title>
        {/*<div className="flex justify-end">
            <button className="rounded-full text-white bg-welcomeGreen mt-4 mr-4 w-10 h-10 flex items-center justify-center"
            onClick={handleTSClick}
            >TS
            </button>
            {showLogout && (
            <div className="absolute mt-12 mr-12 bg-white shadow-strong rounded-lg">
              <button onClick={handleLogOut} className="bg-white text-black py-2 px-6 rounded-lg border-black border-[1px]">
                Log out
              </button>
            </div>
            )}
        </div>*/}
        <div className="relative flex flex-col items-center pt-11 pb-11 justify-center h-screen space-y-3">
          <div className="flex justify-center w-full">
            <Image src={Logo} alt="Logo" className="w-32 h-32 -mt-3"/>
            <button 
              className="absolute top-12 right-5 rounded-full text-white bg-welcomeGreen w-10 h-10"
              onClick={handleTSClick}
            >
              TS
            </button>
            {showLogout && (
            <div className="absolute top-24 right-4 bg-white shadow-strong rounded-lg">
              <button onClick={handleLogOut} className="bg-white text-black py-2 px-6 rounded-lg border-black border-[1px]">
                Log out
              </button>
            </div>
            )}
          </div>
          {!resultPage && <div className="text-center lato text-3xl text-cyan w-[70%] font-bold">
            {processing ? "Just One Moment" : "Scan a Nutrition Label"}
          </div>}
          {resultPage && <div className={`text-center lato text-3xl ${safeToConsume ? 'text-green-500' : 'text-red-500'} w-[70%] font-bold`}>
            {safeToConsume ? "Safe To Consume" : "Not Safe To Consume"}
          </div>}
          {resultPage && <div className="text-center text-signupGray w-[70%]">{claudeMessage}</div>}
          {resultPage && <LongButton text="BACK" onClick={handleBackButton} />}
          {processing && <div className="text-center text-signupGray">Processing...</div>}
          {scanButton && <LongButton text="SCAN" onClick={handleScanClick} />}
          <WebcamCapture openCamera={openCamera} setCapturedImage={setCapturedImage} setOpenCamera={setOpenCamera} setProcessing={setProcessing} />
          <div className="flex flex-col items-center space-y-4">
            {capturedImage && (
              <>
                <Image src={capturedImage} alt="Captured Nutrition Label" width={350} height={350} />
                {rescan && <LongButton text="SUBMIT" onClick={handleSubmitClick} />}
                {rescan && <LongButton text="RESCAN" onClick={handleRescanClick}/>}
              </>
            )}
          </div>
        </div>
      </>
      : 
      <Desktop />
    ) : null}
    </>
  );
}