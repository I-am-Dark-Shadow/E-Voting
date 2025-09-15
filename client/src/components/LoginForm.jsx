import React, { useState, useRef } from 'react';
import { ScanFace, Loader2 } from 'lucide-react';
import CameraCapture from './CameraCapture';
import { getFullFaceDescription } from '../utils/faceUtils';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
// useNavigate আর প্রয়োজন নেই কারণ আমরা window.location.href ব্যবহার করছি

const LoginForm = () => {
  const [status, setStatus] = useState('Initializing camera...');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { login } = useAuth();
  // const navigate = useNavigate(); // এই লাইনের আর প্রয়োজন নেই

  const handleStream = (videoElement) => {
    videoRef.current = videoElement;
    setIsCameraReady(true);
    setStatus('Camera Ready. Click "Start Scan".');
  };

  const handleScan = async () => {
    // captureAndLogin is now defined inside handleScan to be self-contained
    const captureAndLogin = async () => {
        if (!videoRef.current) return;
        setError('');
        setIsLoading(true);
        setStatus('Scanning...');
    
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
    
        canvas.toBlob(async (blob) => {
            const fullDesc = await getFullFaceDescription(blob);
            if (fullDesc) {
                try {
                    const descriptorArray = Array.from(fullDesc.descriptor);
                    const { data } = await loginUser(descriptorArray);
                    login(data); // Save user data to context and localStorage
                    setStatus('Login Successful! Redirecting...');
                    
                    // This is the key change: use window.location.href to force a full page refresh
                    if (data.role === 'admin') {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = '/dashboard';
                    }
    
                } catch (err) {
                    setError(err.response?.data?.message || 'Login failed.');
                    setStatus('Scan again.');
                    setIsLoading(false);
                }
            } else {
                setError('No face detected. Please try again.');
                setStatus('Scan again.');
                setIsLoading(false);
            }
        }, 'image/jpeg');
    };

    captureAndLogin();
  };

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} className="hidden"></canvas>
      <div className="relative overflow-hidden rounded-xl ring-1 ring-white/10 bg-white/5">
        <CameraCapture onStream={handleStream} onStreamError={() => setError("Camera access denied or not available.")} />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-3 top-3 h-6 w-6 border-t-2 border-l-2 border-cyan-300/70 rounded-tl"></div>
          <div className="absolute right-3 top-3 h-6 w-6 border-t-2 border-r-2 border-cyan-300/70 rounded-tr"></div>
          <div className="absolute left-3 bottom-3 h-6 w-6 border-b-2 border-l-2 border-cyan-300/70 rounded-bl"></div>
          <div className="absolute right-3 bottom-3 h-6 w-6 border-b-2 border-r-2 border-cyan-300/70 rounded-br"></div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button onClick={handleScan} disabled={isLoading || !isCameraReady} className="group relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-slate-100 ring-1 ring-cyan-400/30 bg-cyan-400/10 hover:bg-cyan-400/15 transition disabled:opacity-50">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanFace className="h-4 w-4" />}
          {isLoading ? 'Scanning...' : 'Start Scan'}
        </button>
        <p className={`text-sm h-5 ${error ? 'text-red-400' : 'text-slate-400'}`}>
          {error || status}
        </p>
      </div>
    </div>
  );
};

export default LoginForm;