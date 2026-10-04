import { ArrowLeft } from 'lucide-react';
import { useNewTestStore } from './store';
import { useNavigate } from 'react-router';
import { cn } from '../../app/Layout';

// Mock components for the steps
import { Step1Details } from './steps/Step1Details';
import { Step2Capture } from './steps/Step2Capture';
import { Step3Calibrate } from './steps/Step3Calibrate';
import { Step4Result } from './steps/Step4Result';
import { Step5Seal } from './steps/Step5Seal';

export function NewTestWizard() {
  const { step, setStep } = useNewTestStore();
  const navigate = useNavigate();

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100dvh-4rem)] md:h-[calc(100dvh-6rem)] flex flex-col relative overflow-hidden bg-bg">
      <header className="flex items-center justify-between p-4 bg-surface border-b border-border shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-2 text-muted hover:text-text transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-text leading-tight">New Test</h2>
            <p className="text-xs text-muted font-medium">Step {step} of 5</p>
          </div>
        </div>
        
        {/* Progress Dots */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map(s => (
            <div 
              key={s} 
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                step === s ? "w-6 bg-primary" : step > s ? "w-2 bg-primary/50" : "w-2 bg-surface-2"
              )}
            />
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto relative p-4 pb-24 md:p-6 md:pb-24 scroll-smooth">
        {step === 1 && <Step1Details />}
        {step === 2 && <Step2Capture />}
        {step === 3 && <Step3Calibrate />}
        {step === 4 && <Step4Result />}
        {step === 5 && <Step5Seal />}
      </div>
    </div>
  );
}
