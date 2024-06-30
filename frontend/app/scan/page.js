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
  };

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

  const handleSubmitClick = () => {
    setProcessing(true); // processing(API) starts
    setRescan(false); // No Rescan & Submit button

    console.log('api called');
    console.log('api finished');

    setProcessing(false); // processing is done
    setResultPage(true); // show result page
    setCapturedImage(null); // discard image

    // if safe to consume else => setSafeToConsume(false);
    setSafeToConsume(false);
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
      // router.push('/welcome');
    }
  }, [sessionID]);



  
  const videoConstraints = {
    width: 1080,
    height: 1920,
    facingMode: 'environment'
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
          {captureButton && <LongButton text="CAPTURE" onClick={capture}/>}
          <LongButton text="CANCEL" onClick={handleCancelClick}/>
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
        <button 
              className="absolute top-8 right-6 rounded-full text-white bg-welcomeGreen w-10 h-10"
              onClick={handleTSClick}
            >
              TS
        </button>
        {showLogout && (
        <div className="top-16 right-12 bg-white shadow-strong rounded-lg">
          <button onClick={handleLogOut} className="absolute bg-white text-black py-2 px-6 rounded-lg border-black border-[1px]">
            Log out
          </button>
        </div>
        )}
        <div className="flex flex-col items-center pt-11 pb-11 justify-center h-screen space-y-3">
          <div className="relative flex justify-center w-full">
            <Image src={Logo} alt="Logo" className="w-32 h-32 -mt-3"/>
          </div>
          {!resultPage && <div className="text-center lato text-3xl text-cyan w-[70%] font-bold">
            {processing ? "Just One Moment" : "Scan a Nutrition Label"}
          </div>}
          {resultPage && <div className={`text-center lato text-3xl ${safeToConsume ? 'text-green-500' : 'text-red-500'} w-[70%] font-bold`}>
            {safeToConsume ? "Safe To Consume" : "Not Safe To Consume"}
          </div>}
          {resultPage && <div className="text-center text-signupGray w-[70%]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>}
          {resultPage && <LongButton text="BACK" onClick={handleBackButton} />}
          {processing && <div className="text-center text-signupGray">Processing...</div>}
          {scanButton && <LongButton text="SCAN" onClick={handleScanClick} />}
          <WebcamCapture openCamera={openCamera} setCapturedImage={setCapturedImage} setOpenCamera={setOpenCamera} setProcessing={setProcessing} />
          <div className="flex flex-col items-center space-y-4">
            {capturedImage && (
              <>
                <Image src={capturedImage} alt="Captured Nutrition Label" width={350} height={350} />
                {rescan && <LongButton text="SUBMIT" onClick={handleSubmitClick} />}
                {rescan && <LongButton text="RESCAN" onClick={handleRescanClick} />}
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
