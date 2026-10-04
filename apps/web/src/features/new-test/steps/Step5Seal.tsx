import { useNewTestStore } from '../store';
import { Shield, CheckCircle2, Download, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { cn } from '../../../app/Layout';

export function Step5Seal() {
  const { testId, reset } = useNewTestStore();
  const [ticks, setTicks] = useState(0);

  const steps = [
    'Original image hashed (SHA-256)',
    'Calibrated image hashed',
    'Timestamp recorded',
    'Location attached',
    'Operator and device identified',
    'Linked to previous record',
    'Record signed (Ed25519)',
    'Saved on this device',
    'Uploaded and receipted by server'
  ];

  useEffect(() => {
    if (ticks < steps.length) {
      const timer = setTimeout(() => {
        setTicks(t => t + 1);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [ticks]);

  const done = ticks === steps.length;

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      
      {!done ? (
        <div className="bg-surface border border-border rounded-[24px] p-6 shadow-sm">
          <h2 className="text-xl font-bold text-text mb-6">Sealing Record...</h2>
          <ul className="space-y-4">
            {steps.map((step, i) => {
              const active = i === ticks;
              const complete = i < ticks;
              
              if (!active && !complete) return null;

              return (
                <li key={i} className={cn(
                  "flex items-center gap-3 text-sm animate-in fade-in slide-in-from-bottom-2",
                  complete ? "text-muted" : "text-text font-medium"
                )}>
                  {complete ? (
                    <CheckCircle2 className="w-5 h-5 text-positive" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  )}
                  {step}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-[24px] p-8 shadow-sm text-center animate-in zoom-in-95 duration-500">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping opacity-75 duration-1000"></div>
            <div className="relative w-full h-full bg-accent text-white rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-12 h-12" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-accent mb-2">RECORD SEALED</h2>
          <p className="text-muted mb-6">The evidence has been cryptographically signed and secured.</p>
          
          <div className="bg-surface-2 p-4 rounded-xl border border-border mb-8 text-left">
             <div className="flex justify-between items-center mb-2">
               <span className="text-xs text-muted font-medium">Test ID</span>
               <span className="font-mono text-sm text-text font-semibold">{testId}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-xs text-muted font-medium">Status</span>
               <span className="text-xs text-positive font-bold tracking-wider px-2 py-0.5 rounded bg-positive/10 border border-positive/20">SYNCED</span>
             </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link to={`/records/${testId}`} className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors">
              <ExternalLink className="w-5 h-5" />
              View Record
            </Link>
            <button 
              onClick={() => { reset(); }}
              className="w-full h-12 bg-surface-2 hover:bg-border border border-border text-text font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Start New Test
            </button>
            <button className="w-full h-12 text-muted hover:text-text font-medium rounded-xl flex items-center justify-center gap-2 transition-colors mt-2">
              <Download className="w-4 h-4" /> Download certificate (PNG)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
