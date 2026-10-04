import { useNewTestStore } from '../store';
import { Camera, Image as ImageIcon, Upload, Zap, RefreshCw } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../../app/Layout';

export function Step2Capture() {
  const { setStep, setImage } = useNewTestStore();
  const [tab, setTab] = useState<'live'|'phone'|'upload'>('live');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Live camera stream logic
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (tab === 'live') {
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      })
      .then((mediaStream) => {
        stream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
        // Could show a toast or error message here
      });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [tab]);

  const captureLivePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setImage(dataUrl);
        setStep(3);
      }
    }
  }, [setImage, setStep]);

  // Mock handling file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImage(ev.target.result as string);
          setStep(3);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      
      {/* Tabs */}
      <div className="flex bg-surface-2 p-1 rounded-xl border border-border max-w-sm mx-auto">
        <button onClick={() => setTab('live')} className={cn("flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors", tab === 'live' ? "bg-surface shadow-sm text-text" : "text-muted hover:text-text")}>
          <Camera className="w-4 h-4" /> Live
        </button>
        <button onClick={() => setTab('phone')} className={cn("flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors", tab === 'phone' ? "bg-surface shadow-sm text-text" : "text-muted hover:text-text")}>
          <ImageIcon className="w-4 h-4" /> Camera App
        </button>
        <button onClick={() => setTab('upload')} className={cn("flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors", tab === 'upload' ? "bg-surface shadow-sm text-text" : "text-muted hover:text-text")}>
          <Upload className="w-4 h-4" /> Upload
        </button>
      </div>

      <div className="bg-surface border border-border rounded-[24px] overflow-hidden shadow-sm relative h-[60dvh] md:h-[500px]">
        
        {tab === 'live' && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
            {/* Live camera stream */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            <div className="absolute inset-8 border-2 border-white/40 rounded-2xl pointer-events-none">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-xl" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-xl" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-xl" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-xl" />
              
              {/* Test zone outline */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-20 border border-white/50 border-dashed rounded-lg flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-white/50 border-dashed" />
              </div>
            </div>

            {/* Quality Chips */}
            <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2 justify-center z-10">
              <span className="bg-positive text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">CARD DETECTED</span>
              <span className="bg-positive text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">SHARPNESS GOOD</span>
              <span className="bg-inconclusive text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">GLARE DETECTED</span>
            </div>

            <div className="absolute bottom-6 flex items-center gap-6 z-10">
              <button className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-md">
                <Zap className="w-6 h-6" />
              </button>
              <button 
                onClick={captureLivePhoto}
                className="w-16 h-16 rounded-full bg-white border-4 border-black/20 outline outline-2 outline-white shadow-xl flex items-center justify-center hover:scale-95 transition-transform"
              >
              </button>
              <button className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-md">
                <RefreshCw className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {tab === 'phone' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mb-4 border border-border">
              <ImageIcon className="w-8 h-8 text-muted" />
            </div>
            <h3 className="text-lg font-bold text-text mb-2">Use Phone Camera App</h3>
            <p className="text-muted text-sm mb-6 max-w-xs">Capture the evidence using your device's native camera app for highest resolution.</p>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="h-12 px-6 bg-primary text-white font-medium rounded-xl shadow-lg"
            >
              Open Camera
            </button>
          </div>
        )}

        {tab === 'upload' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mb-4 border border-border">
              <Upload className="w-8 h-8 text-muted" />
            </div>
            <h3 className="text-lg font-bold text-text mb-2">Upload Image</h3>
            <p className="text-muted text-sm mb-2 max-w-xs">Upload a previously captured photo.</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-inconclusive/10 text-inconclusive border border-inconclusive/20 mb-6">IMPORTED IMAGE FLAG WILL BE APPLIED</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="h-12 px-6 bg-surface-2 text-text font-medium rounded-xl border border-border shadow-sm"
            >
              Select File
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
