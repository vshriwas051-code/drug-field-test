import { useNewTestStore } from '../store';
import { MapPin, ArrowRight } from 'lucide-react';

export function Step1Details() {
  const { testId, sampleRef, kitProfileId, setDetails, setStep } = useNewTestStore();

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="bg-surface border border-border rounded-[16px] p-5 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-medium text-muted mb-1.5">Test ID (Auto-generated)</label>
          <input 
            type="text" 
            value={testId} 
            disabled 
            className="w-full h-12 bg-bg border border-border rounded-xl px-4 text-muted font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted mb-1.5">Operator ID</label>
          <input 
            type="text" 
            value="OP-102" 
            disabled 
            className="w-full h-12 bg-bg border border-border rounded-xl px-4 text-muted font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Kit Profile</label>
          <select 
            value={kitProfileId}
            onChange={(e) => setDetails({ kitProfileId: e.target.value })}
            className="w-full h-12 bg-surface-2 border border-border rounded-xl px-4 text-text focus:outline-none focus:border-primary"
          >
            <option value="demo-kit-a">Demo Kit A (Negative, Positive)</option>
            <option value="demo-kit-b">Demo Kit B (Negative, Positive)</option>
          </select>
          {/* Swatches would go here */}
          <div className="flex gap-2 mt-2">
            <div className="flex items-center gap-1.5 bg-bg px-2 py-1 rounded border border-border">
              <span className="w-3 h-3 rounded-full bg-[#EAD98C]"></span>
              <span className="text-xs text-muted font-medium">NEG</span>
            </div>
            <div className="flex items-center gap-1.5 bg-bg px-2 py-1 rounded border border-border">
              <span className="w-3 h-3 rounded-full bg-[#7E4DB3]"></span>
              <span className="text-xs text-muted font-medium">POS</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Batch Number</label>
          <input 
            type="text" 
            placeholder="e.g. BT-2026-0182"
            className="w-full h-12 bg-surface-2 border border-border rounded-xl px-4 text-text focus:outline-none focus:border-primary uppercase"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Sample Reference *</label>
          <input 
            type="text" 
            value={sampleRef}
            onChange={(e) => setDetails({ sampleRef: e.target.value })}
            placeholder="e.g. SR-2026-00412"
            className="w-full h-12 bg-surface-2 border border-border rounded-xl px-4 text-text focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-text">Location</label>
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-positive/10 text-positive border border-positive/20">±18 m</span>
          </div>
          <div className="relative">
            <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
            <input 
              type="text" 
              value="Bengaluru, Karnataka" 
              disabled 
              className="w-full h-12 bg-bg border border-border rounded-xl pl-10 pr-4 text-text"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Remarks (Optional)</label>
          <textarea 
            rows={2}
            className="w-full bg-surface-2 border border-border rounded-xl p-3 text-text focus:outline-none focus:border-primary resize-none"
            placeholder="Add any notes about the sample or environment..."
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface border-t border-border z-20 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <button 
          onClick={() => setStep(2)}
          disabled={!sampleRef}
          className="w-full max-w-3xl mx-auto h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          Next: Capture Image <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
