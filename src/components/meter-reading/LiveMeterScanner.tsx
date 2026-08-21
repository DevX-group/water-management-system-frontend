import React, { useRef, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LiveMeterScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onDetected: (reading: string, imageBlob?: Blob) => void;
}

export const LiveMeterScanner: React.FC<LiveMeterScannerProps> = ({ isOpen, onClose, onDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let scanInterval: NodeJS.Timeout;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        // Take a picture and send to OCR every 2.5 seconds
        scanInterval = setInterval(captureAndScan, 2500);
      } catch (err) {
        setError("Camera access denied or not available on this device.");
        console.error(err);
      }
    };

    const captureAndScan = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      if (isScanning) return; // Prevent overlapping requests

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video.videoWidth === 0) return;

      setIsScanning(true);
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
          if (!blob) {
            setIsScanning(false);
            return;
          }
          
          const formData = new FormData();
          formData.append('image', blob, 'capture.jpg');
          
          try {
            const response = await fetch('http://127.0.0.1:5000/ocr', {
              method: 'POST',
              body: formData,
            });
            const data = await response.json();
            if (data.success && data.meter_reading && data.meter_reading.length >= 2) {
               onDetected(data.meter_reading, blob);
               onClose();
            }
          } catch (err) {
             console.log("OCR check failed, retrying...");
          } finally {
            setIsScanning(false);
          }
        }, 'image/jpeg');
      }
    };

    if (isOpen) {
      setError(null);
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (scanInterval) {
        clearInterval(scanInterval);
      }
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md border-0 p-0 overflow-hidden bg-black">
        <DialogHeader className="p-4 bg-background/90 absolute top-0 w-full z-10">
          <DialogTitle>Point Camera at Meter</DialogTitle>
        </DialogHeader>
        <div className="relative flex flex-col items-center justify-center h-[70vh] max-h-[500px] w-full bg-black">
          {error ? (
            <p className="text-red-500 p-4 text-center">{error}</p>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 pointer-events-none border-[50px] border-black/50">
                  <div className="w-full h-full border-2 border-primary animate-pulse relative"></div>
              </div>
              
              <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
                <div className="bg-black/70 px-4 py-2 rounded-full flex items-center gap-2 text-white text-sm shadow-lg">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  Scanning automatically...
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
