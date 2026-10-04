import { useNewTestStore } from '../store';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Step3Calibrate() {
  const { setStep, setAnalysis, imageBlob } = useNewTestStore();
  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    // Mock analysis pipeline delay
    const timer = setTimeout(() => {
      setAnalyzing(false);
      setAnalysis({
        machineResult: 'PRESUMPTIVE_POSITIVE',
        matchScore: 0.8731,
        reasons: [],
        calibrationDeltaE: { mean: 2.104, max: 4.318 },
        quality: { sharpness: 142.3, whiteMean: 201.4, glarePct: 0.2, lightGradientL: 3.1 }
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [setAnalysis]);

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="bg-surface border border-border rounded-[16px] overflow-hidden shadow-sm">
        
        {/* Before/After slider placeholder */}
        <div className="h-48 md:h-64 bg-surface-2 relative flex items-center justify-center border-b border-border">
          {analyzing ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-sm font-medium text-muted">Locating markers & calibrating...</p>
            </div>
          ) : (
            <div className="w-full h-full relative">
              <div className="absolute inset-0 flex">
                <div className="flex-1 bg-surface-2/80 flex items-center justify-center border-r-2 border-primary/50 relative overflow-hidden">
                  <span className="absolute bottom-2 left-2 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded font-medium">Original</span>
                  {imageBlob && <img src={imageBlob} className="w-full h-full object-cover opacity-50 blur-sm" />}
                </div>
                <div className="flex-1 bg-surface flex items-center justify-center relative overflow-hidden">
                  <span className="absolute bottom-2 right-2 text-[10px] bg-primary text-white px-1.5 py-0.5 rounded font-medium">Calibrated</span>
                  {/* Corrected card mock */}
                  <div className="w-[80%] h-[70%] border border-border bg-white rounded shadow-sm relative flex items-center justify-center">
                     <div className="absolute inset-2 border border-dashed border-gray-300"></div>
                     <div className="w-12 h-12 rounded-full border border-dashed border-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                       {/* Sample circle */}
                       <div className="absolute inset-1 rounded-full bg-[#6B3FA0] opacity-90 shadow-inner"></div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quality checklist */}
        <div className="p-5">
          <h3 className="text-sm font-semibold text-text uppercase tracking-wider mb-4">Pipeline Quality</h3>
          <ul className="space-y-3">
            {[
              { label: 'Card located (4/4 markers)', value: 'Pass', pass: true },
              { label: 'Lighting (white patch)', value: 'Pass (201.4)', pass: true },
              { label: 'Sharpness', value: 'Pass (142.3)', pass: true },
              { label: 'Even lighting', value: 'Pass (ΔL* 3.1)', pass: true },
              { label: 'Calibration error', value: 'Good (mean ΔE 2.1)', pass: true }
            ].map((check, i) => (
              <li key={i} className="flex justify-between items-center text-sm">
                <span className="text-muted flex items-center gap-2">
                  {check.pass ? <CheckCircle2 className="w-4 h-4 text-positive" /> : <AlertCircle className="w-4 h-4 text-danger" />}
                  {check.label}
                </span>
                <span className="font-medium text-text">{check.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface border-t border-border z-20 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <button 
          onClick={() => setStep(4)}
          disabled={analyzing}
          className="w-full max-w-3xl mx-auto h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          Next: View Result <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
