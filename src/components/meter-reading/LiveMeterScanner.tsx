import React, { useRef, useState, useEffect } from 'react';
import { Loader2, Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LiveMeterScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onDetected: (reading: string, imageBlob?: Blob) => void;
}

async function extractMeterReading(blob: Blob): Promise<string | null> {
  const formData = new FormData();
  formData.append('image', blob, 'capture.jpg');
  
  try {
    const response = await fetch('http://127.0.0.1:5000/ocr', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (data.success && data.meter_reading && data.meter_reading.length >= 2) {
      return data.meter_reading;
    }
    return null;
  } catch (err) {
    console.error('OCR server error:', err);
    return null;
  }
}

export const LiveMeterScanner: React.FC<LiveMeterScannerProps> = ({ isOpen, onClose, onDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureAndExtract = async () => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.videoWidth === 0) {
      setError('Camera not ready. Please wait.');
      return;
    }

    setIsCapturing(true);
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async (blob) => {
        if (!blob) { setIsCapturing(false); return; }
        try {
          const reading = await extractMeterReading(blob);
          // Whether extraction succeeded or not, pass blob + reading (empty if failed)
          onDetected(reading || '', blob);
          onClose();
        } catch (err) {
          console.error('Extraction error:', err);
          onDetected('', blob);
          onClose();
        } finally {
          setIsCapturing(false);
        }
      }, 'image/jpeg', 0.95);
    }
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        setError('Camera access denied or not available.');
        console.error(err);
      }
    };

    if (isOpen) {
      setError(null);
      setIsCapturing(false);
      startCamera();
    }
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
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
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />

              {/* Frame overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 border-[60px] border-black/50" />
                <div className="absolute inset-[60px] border-2 border-primary rounded-sm">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary" />
                </div>
                {!isCapturing && (
                  <p className="absolute top-[68px] w-full text-center text-white/60 text-xs px-4">
                    Align the meter digits within the frame
                  </p>
                )}
              </div>

              {/* Bottom */}
              <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 z-10">
                {isCapturing ? (
                  <div className="bg-black/80 px-5 py-3 rounded-full flex items-center gap-2 text-white text-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    Extracting reading with AI...
                  </div>
                ) : (
                  <button
                    onClick={captureAndExtract}
                    className="bg-primary hover:bg-primary/90 px-8 py-3 rounded-full flex items-center gap-2 text-white font-semibold shadow-xl transition-all active:scale-95"
                  >
                    <Camera className="w-5 h-5" />
                    Capture &amp; Extract
                  </button>
                )}
                {!isCapturing && (
                  <p className="text-white/40 text-xs text-center px-4">
                    If AI cannot read it, image will be saved and you can type manually
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

