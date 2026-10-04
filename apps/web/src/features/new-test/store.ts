import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface NewTestState {
  step: number;
  testId: string;
  sampleRef: string;
  kitProfileId: string;
  location: any;
  imageBlob: string | null; // store as base64 for persistence
  analysisResult: any | null;
  operatorReview: any | null;
  
  setStep: (step: number) => void;
  setDetails: (details: any) => void;
  setImage: (blobDataUrl: string) => void;
  setAnalysis: (result: any) => void;
  setOperatorReview: (review: any) => void;
  reset: () => void;
}

export const useNewTestStore = create<NewTestState>()(
  persist(
    (set) => ({
      step: 1,
      testId: `CT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(Math.random() * 10000)}`,
      sampleRef: '',
      kitProfileId: 'demo-kit-a',
      location: null,
      imageBlob: null,
      analysisResult: null,
      operatorReview: null,

      setStep: (step) => set({ step }),
      setDetails: (details) => set((state) => ({ ...state, ...details })),
      setImage: (blobDataUrl) => set({ imageBlob: blobDataUrl }),
      setAnalysis: (result) => set({ analysisResult: result }),
      setOperatorReview: (review) => set({ operatorReview: review }),
      reset: () => set({
        step: 1,
        testId: `CT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(Math.random() * 10000)}`,
        sampleRef: '',
        location: null,
        imageBlob: null,
        analysisResult: null,
        operatorReview: null
      })
    }),
    {
      name: 'chromaseal-wizard-storage',
      storage: createJSONStorage(() => sessionStorage), // persist across page refreshes
    }
  )
);
