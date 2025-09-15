import React, { useEffect, useRef } from 'react';

const CameraCapture = ({ onStream, onStreamError }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream = null;

    const startStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          onStream(videoRef.current); // Pass video element to parent
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        onStreamError(err);
      }
    };

    startStream();

    // Cleanup function to stop the stream when the component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onStream, onStreamError]);

  return (
    <div className="aspect-video w-full bg-black/40 grid place-items-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full object-cover"
      ></video>
    </div>
  );
};

export default CameraCapture;