"use client";
import Image from "next/image";
import Logo from "@/public/Nutrition Scanner-Private-PNG.png";
import LongButton from "@/components/LongButton";
import Webcam from "react-webcam";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { isMobile } from "react-device-detect";
import Desktop from "@/components/Desktop";
import { useRouter } from "next/navigation";

export default function ScanPage() {
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

  const [claudeMessage, setClaudeMessage] = useState("");

  const[logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setClientIsMobile(isMobile);
  });

  // When pressed on TS button, logout drops down.
  const handleTSClick = () => {
    setShowLogout(!showLogout);
  };

  const handleLogOut = () => {
    setLogoutLoading(true);
    delete_cookie("sessionID");
    delete_cookie("A");
    delete_cookie("B");
    delete_cookie("C");
    delete_cookie("D");
    delete_cookie("E");
    delete_cookie("F");
    setLogoutLoading(false);
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  function get_cookie_value(name) {
    const cookies = document.cookie.split(";").map(cookie => cookie.trim());
  
    for (let cookie of cookies) {
      if (cookie.startsWith(name + "=")) {
        const value = cookie.substring(name.length + 1);
      return value === "true" ? true : value === "false" ? false : value;
      }
    }
    return null; // Return null if cookie with given name is not found
  }
  

  function get_cookie(name) {
    return document.cookie.split(";").some((c) => {
      return c.trim().startsWith(name + "=");
    });
  }

  function delete_cookie(name, path="/", domain) {
    if (get_cookie(name)) {
      document.cookie = `${name}=; path=${path}; domain=${
        domain ? domain : ""
      }; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    setSessionID(null);
  }

  const handleScanClick = () => {
    setOpenCamera(true);
    setScanButton(false);

    // timeout
    setTimeout(() => {
      setCaptureButton(true);
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

  const handleSubmitClick = async (e) => {
    setProcessing(true); // processing(API) starts
    setRescan(false); // No Rescan & Submit button

    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: capturedImage,
        }),
      });

      if (!response.ok) {
        throw new Error("Scan failed");
      }

      const data = await response.json();
      const arr = data.options;
      if (getCookie("A") && !arr.includes("A") && get_cookie_value("A") === true) {
        setSafeToConsume(false);
        setClaudeMessage("This product is not suitable for vegans.");
        setProcessing(false); // processing is done
        setResultPage(true); // show result page
        setCapturedImage(null); // discard image
        return;
      }
      if (getCookie("B") && !arr.includes("B") && get_cookie_value("B") === true) {
        setSafeToConsume(false);
        setClaudeMessage("This product is not suitable for vegetarians.");
        setProcessing(false); // processing is done
        setResultPage(true); // show result page
        setCapturedImage(null); // discard image
        return;
      }
      if (getCookie("C") && !arr.includes("C") && get_cookie_value("C") === true) {
        setSafeToConsume(false);
        setClaudeMessage("This product is not halal.");
        setProcessing(false); // processing is done
        setResultPage(true); // show result page
        setCapturedImage(null); // discard image
        return;
      }
      if (getCookie("D") && !arr.includes("D") && get_cookie_value("D") === true) {
        setSafeToConsume(false);
        setClaudeMessage("This product is not gluten-free.");
        setProcessing(false); // processing is done
        setResultPage(true); // show result page
        setCapturedImage(null); // discard image
        return;
      }
      if (getCookie("E") && !arr.includes("E") && get_cookie_value("E") === true) {
        setSafeToConsume(false);
        setClaudeMessage("This product is not dairy-free.");
        setProcessing(false); // processing is done
        setResultPage(true); // show result page
        setCapturedImage(null); // discard image
        return;
      }
      if (getCookie("F") && !arr.includes("F") && get_cookie_value("F") === true) {
        setSafeToConsume(false);
        setClaudeMessage("This product is not nut-free.");
        setProcessing(false); // processing is done
        setResultPage(true); // show result page
        setCapturedImage(null); // discard image
        return;
      }

      setSafeToConsume(true); // Safe to consume
      setClaudeMessage(
        "This product is suitable for you based on your dietary preferences."
      );
      setProcessing(false); // processing is done
      setResultPage(true); // show result page
      setCapturedImage(null); // discard image
    } catch (error) {
      setError(error.message);
    }

    setProcessing(false); // processing is done
    setResultPage(true); // show result page
    setCapturedImage(null); // discard image
  };

  const handleBackButton = () => {
    setResultPage(false);
    setScanButton(true);
  };

  useEffect(() => {
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
    facingMode: "environment",
  };

  const WebcamCapture = ({
    openCamera,
    setCapturedImage,
    setOpenCamera,
    setProcessing,
  }) => {
    const webcamRef = React.useRef(null);
    const capture = React.useCallback(() => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;
        setCapturedImage(imageSrc);
        setOpenCamera(false);
        setRescan(true);
      }
    }, [webcamRef, setCapturedImage, setOpenCamera]);

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
      {isClient ? (
        clientIsMobile ? (
          <>
            <title>Scan</title>
            <div className="flex flex-col pr-5 pt-5 h-40 items-end">
              <button
                className="rounded-full text-white bg-welcomeGreen w-10 h-10 mb-6"
                onClick={handleTSClick}
              >
                TS
              </button>
              {showLogout && (
                !logoutLoading ? <LongButton
                  onClick={handleLogOut}
                  className="bg-white text-black rounded-lg border-black border-[1px]"
                  text="Log Out"
                /> : <LongButton
                onClick={handleLogOut}
                className="bg-white text-black rounded-lg border-black border-[1px]"
                text="Logging Out"
              />
              )}
            </div>
            <div className="relative flex flex-col items-center pb-11 justify-center space-y-3">
              <Image src={Logo} alt="Logo" className="w-32 h-32 mt-5" />
              {!resultPage && (
                <div className="text-center lato text-3xl text-cyan w-[70%] font-bold">
                  {processing ? "Just One Moment" : "Scan a Nutrition Label"}
                </div>
              )}
              {resultPage && (
                <div
                  className={`text-center lato text-3xl ${
                    safeToConsume ? "text-green-500" : "text-red-500"
                  } w-[70%] font-bold`}
                >
                  {safeToConsume ? "Safe To Consume" : "Not Safe To Consume"}
                </div>
              )}
              {resultPage && (
                <div className="text-center text-signupGray w-[70%]">
                  {claudeMessage}
                </div>
              )}
              {resultPage && (
                <LongButton text="BACK" onClick={handleBackButton} />
              )}
              {processing && (
                <div className="text-center text-signupGray">Processing...</div>
              )}
              {scanButton && (
                <LongButton text="SCAN" onClick={handleScanClick} />
              )}
              <WebcamCapture
                openCamera={openCamera}
                setCapturedImage={setCapturedImage}
                setOpenCamera={setOpenCamera}
                setProcessing={setProcessing}
              />
              <div className="flex flex-col items-center space-y-4">
                {capturedImage && (
                  <>
                    <Image
                      src={capturedImage}
                      alt="Captured Nutrition Label"
                      width={350}
                      height={350}
                    />
                    {rescan && (
                      <LongButton text="SUBMIT" onClick={handleSubmitClick} />
                    )}
                    {rescan && (
                      <LongButton text="RESCAN" onClick={handleRescanClick} />
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <Desktop />
        )
      ) : null}
    </>
  );
}
