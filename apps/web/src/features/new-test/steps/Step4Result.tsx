import { useNewTestStore } from '../store';
import { ShieldCheck, FileWarning, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../../app/Layout';

export function Step4Result() {
  const { setStep, analysisResult, setOperatorReview } = useNewTestStore();
  const [review, setReview] = useState<'agree'|'disagree'|null>(null);
  const [disagreeReason, setDisagreeReason] = useState('');

  const handleNext = () => {
    setOperatorReview({ decision: review, note: disagreeReason });
    setStep(5);
  };

  const isPositive = analysisResult?.machineResult === 'PRESUMPTIVE_POSITIVE';
  const isInconclusive = analysisResult?.machineResult === 'INCONCLUSIVE';

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      
      {/* Result Card */}
      <div className="bg-surface border border-border rounded-[24px] p-6 shadow-sm text-center">
        <div className={cn(
          "w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 shadow-inner",
          isPositive ? "bg-positive/20 text-positive" : isInconclusive ? "bg-inconclusive/20 text-inconclusive" : "bg-negative/20 text-negative"
        )}>
          {isPositive ? <ShieldCheck className="w-10 h-10" /> : <FileWarning className="w-10 h-10" />}
        </div>
        <h2 className={cn(
          "text-2xl font-bold mb-1",
          isPositive ? "text-positive" : isInconclusive ? "text-inconclusive" : "text-negative"
        )}>
          {analysisResult?.machineResult.replace('_', ' ')}
        </h2>
        
        {/* Match score bar */}
        {!isInconclusive && (
          <div className="mt-6">
            <div className="flex justify-between text-xs text-muted mb-1.5 font-medium">
              <span>Match Confidence</span>
              <span>{(analysisResult?.matchScore * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden border border-border/50">
              <div 
                className={cn("h-full rounded-full transition-all duration-1000", isPositive ? "bg-positive" : "bg-negative")}
                style={{ width: `${analysisResult?.matchScore * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-muted mt-2">Relative closeness to configured reference colours, not a statistical probability.</p>
          </div>
        )}
      </div>

      <div className="bg-surface-2 border border-border p-4 rounded-xl flex items-start gap-3">
        <FileWarning className="w-5 h-5 text-muted shrink-0 mt-0.5" />
        <p className="text-sm text-text">
          <span className="font-semibold">Presumptive field result.</span> Laboratory confirmation required.
        </p>
      </div>

      {/* Operator Review */}
      <div className="bg-surface border border-border rounded-[16px] p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-text uppercase tracking-wider mb-4">Operator Review</h3>
        <p className="text-sm text-muted mb-4">Do you agree with the machine's presumptive result?</p>
        
        <div className="space-y-3">
          <button 
            onClick={() => setReview('agree')}
            className={cn(
              "w-full p-4 rounded-xl border flex items-center justify-between transition-colors",
              review === 'agree' ? "border-primary bg-primary/10 text-text font-medium" : "border-border hover:bg-surface-2 text-muted"
            )}
          >
            <span>I agree with this result</span>
            {review === 'agree' && <CheckCircle2 className="w-5 h-5 text-primary" />}
          </button>
          
          <button 
            onClick={() => setReview('disagree')}
            className={cn(
              "w-full p-4 rounded-xl border flex items-center justify-between transition-colors",
              review === 'disagree' ? "border-danger bg-danger/10 text-text font-medium" : "border-border hover:bg-surface-2 text-muted"
            )}
          >
            <span>My visual reading differs</span>
            {review === 'disagree' && <CheckCircle2 className="w-5 h-5 text-danger" />}
          </button>
        </div>

        {review === 'disagree' && (
          <div className="mt-4 animate-in fade-in duration-300">
             <label className="block text-sm font-medium text-text mb-1.5">Note on visual reading *</label>
             <textarea 
               value={disagreeReason}
               onChange={(e) => setDisagreeReason(e.target.value)}
               rows={2}
               className="w-full bg-surface-2 border border-border rounded-xl p-3 text-text focus:outline-none focus:border-danger resize-none text-sm"
               placeholder="Why does your reading differ?"
             />
             <p className="text-xs text-danger mt-2">Disagreement switches the reported result to INCONCLUSIVE — referred for laboratory confirmation.</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface border-t border-border z-20 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <button 
          onClick={handleNext}
          disabled={!review || (review === 'disagree' && !disagreeReason)}
          className="w-full max-w-3xl mx-auto h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          Seal Record <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Temporary for missing import
function CheckCircle2(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>
    </svg>
  );
}
