
import React, { useRef, useState, useCallback, useEffect } from 'react';

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<'initializing' | 'ready' | 'error' | 'denied'>('initializing');
  const [errorMessage, setErrorMessage] = useState('');

  const startCamera = useCallback(async () => {
    setStatus('initializing');
    
    // Check if we are in a secure context (required for camera)
    if (!window.isSecureContext) {
      setStatus('error');
      setErrorMessage("Camera access requires a secure (HTTPS) connection. Please check your URL.");
      return;
    }

    try {
      // Try to get the rear camera first
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatus('ready');
      }
    } catch (err) {
      console.error("Camera access error:", err);
      
      if (err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
        setStatus('denied');
      } else {
        // Fallback to any available camera
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            setStatus('ready');
          }
        } catch (fallbackErr) {
          setStatus('error');
          setErrorMessage("No camera hardware detected or accessible on this device.");
        }
      }
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const takePhoto = () => {
    if (videoRef.current && status === 'ready') {
      const canvas = document.createElement('canvas');
      // Use actual video dimensions for capture
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          onCapture(blob);
          onClose();
        }
      }, 'image/jpeg', 0.95);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
      <div className="relative w-full h-full max-w-lg bg-gray-900 md:rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header Overlay */}
        <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
          <button 
            onClick={onClose} 
            className="p-2 text-white bg-black/20 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close Camera"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${status === 'ready' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-white text-[10px] font-bold tracking-widest uppercase opacity-80">
              {status === 'ready' ? 'Live Preview' : 'Camera Offline'}
            </span>
          </div>
          <div className="w-10" /> {/* Symmetry spacer */}
        </div>

        {/* Viewfinder Area */}
        <div className="flex-grow relative flex items-center justify-center bg-black overflow-hidden">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className={`w-full h-full object-cover transition-opacity duration-700 ${status === 'ready' ? 'opacity-100' : 'opacity-0'}`}
          />
          
          {status === 'initializing' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm font-medium tracking-wide">Initializing Camera...</p>
            </div>
          )}

          {status === 'denied' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-8 text-center">
              <div className="w-20 h-20 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Camera Access Required</h3>
              <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                To scan lesions, we need permission to use your camera. Please click "Allow" in your browser's prompt or update your site settings.
              </p>
              <div className="flex flex-col w-full space-y-3">
                <button 
                  onClick={startCamera}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
                >
                  Try Again
                </button>
                <button 
                  onClick={onClose}
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-8 text-center">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-bold mb-2">Connection Issue</p>
              <p className="text-sm text-gray-400 mb-8">{errorMessage}</p>
              <button 
                onClick={onClose}
                className="bg-white text-black px-8 py-3 rounded-xl font-bold text-sm"
              >
                Close Camera
              </button>
            </div>
          )}

          {/* Guidelines Frame */}
          {status === 'ready' && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <div className="w-72 h-72 border-2 border-white/40 rounded-[2.5rem] border-dashed relative shadow-[0_0_0_1000px_rgba(0,0,0,0.3)]">
                {/* Corner markers */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />
                
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider shadow-lg">
                  Position Lesion Center
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="p-10 bg-black flex justify-center items-center">
          <button 
            onClick={takePhoto}
            disabled={status !== 'ready'}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all transform active:scale-90 ${status === 'ready' ? 'opacity-100' : 'opacity-20'}`}
            aria-label="Capture Photo"
          >
            {/* Shutter Button Ring */}
            <div className="absolute inset-0 border-4 border-white/30 rounded-full" />
            {/* Shutter Button Core */}
            <div className="w-16 h-16 bg-white rounded-full shadow-inner" />
            {/* Focus indicator inside shutter */}
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full opacity-0 group-active:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
