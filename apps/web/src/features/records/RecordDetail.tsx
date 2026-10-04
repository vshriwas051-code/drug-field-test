import { ArrowLeft, ShieldCheck, MapPin, Printer, Download, Clock } from 'lucide-react';
import { Link, useParams } from 'react-router';


export function RecordDetail() {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/records" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-2 text-muted hover:text-text transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-text font-mono">{id || 'CT-D7K2-01285'}</h1>
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border bg-positive/10 text-positive border-positive/20">
              POSITIVE
            </span>
          </div>
          <p className="text-muted text-sm mt-1">Sealed Field Evidence Record</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-2 text-muted hover:text-text transition-colors">
            <Printer className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-2 text-muted hover:text-text transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-surface-2 border border-border p-4 rounded-xl flex items-start gap-3">
        <FileWarningIcon className="w-5 h-5 text-muted shrink-0 mt-0.5" />
        <p className="text-sm text-text">
          <span className="font-semibold">Presumptive field result.</span> Laboratory confirmation required.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Viewer */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col h-[400px]">
          <div className="p-3 border-b border-border flex items-center justify-between bg-surface-2/50">
            <span className="text-sm font-medium text-text">Evidence Image</span>
            <div className="flex bg-surface rounded-lg p-1 border border-border">
              <button className="px-3 py-1 text-xs font-medium bg-primary text-white rounded-md shadow-sm">Original</button>
              <button className="px-3 py-1 text-xs font-medium text-muted hover:text-text">Calibrated</button>
            </div>
          </div>
          <div className="flex-1 bg-black/5 flex items-center justify-center relative">
            <div className="absolute inset-4 border-2 border-dashed border-muted/30 rounded-xl flex items-center justify-center">
              <span className="text-muted text-sm">Image Viewer Placeholder</span>
            </div>
            {/* Overlay sample circle would go here */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] z-10 hidden"></div>
          </div>
        </div>

        {/* Record Info Grid */}
        <div className="space-y-4">
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Metadata</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
              <div>
                <p className="text-muted text-xs mb-1">Time (IST)</p>
                <p className="font-medium text-text flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted" />
                  2026-10-03 10:42
                </p>
              </div>
              <div>
                <p className="text-muted text-xs mb-1">Location</p>
                <p className="font-medium text-text flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted" />
                  Bengaluru (±18m)
                </p>
              </div>
              <div>
                <p className="text-muted text-xs mb-1">Operator</p>
                <p className="font-medium text-text">OP-102</p>
              </div>
              <div>
                <p className="text-muted text-xs mb-1">Device Code</p>
                <p className="font-mono text-text">D7K2</p>
              </div>
              <div>
                <p className="text-muted text-xs mb-1">Kit Profile</p>
                <p className="font-medium text-text">Demo Kit A v1</p>
              </div>
              <div>
                <p className="text-muted text-xs mb-1">Batch</p>
                <p className="font-mono text-text">BT-2026-0182</p>
              </div>
            </div>
          </div>

          {/* Analysis */}
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Analysis</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Machine Result</span>
                <span className="text-sm font-medium text-positive">PRESUMPTIVE_POSITIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Match Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[87%]"></div>
                  </div>
                  <span className="text-sm font-medium font-mono text-text">0.8731</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Operator Review</span>
                <span className="text-sm font-medium text-text">Agreed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cryptographic Integrity */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <h3 className="text-sm font-semibold text-text uppercase tracking-wider">Cryptographic Integrity</h3>
          <span className="ml-auto bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded text-xs font-bold tracking-wide">VERIFIED</span>
        </div>
        
        <div className="space-y-3">
          <HashRow label="Image Hash (SHA-256)" hash="9f3a7c8e9b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8" />
          <HashRow label="Calibrated Hash" hash="e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f" />
          <HashRow label="Record Hash" hash="a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b" />
          <HashRow label="Device Signature" hash="c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d" />
        </div>
      </div>
    </div>
  );
}

function HashRow({ label, hash }: { label: string, hash: string }) {
  const truncated = `${hash.substring(0, 12)}…${hash.substring(hash.length - 8)}`;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-surface-2 border border-border/50 gap-2">
      <span className="text-sm text-muted font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-text select-all">{truncated}</span>
        <button className="text-xs text-primary hover:text-primary/80 font-medium">Copy</button>
      </div>
    </div>
  );
}

function FileWarningIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  );
}
