import { Shield, ShieldAlert, Link as LinkIcon, Filter } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '../../app/Layout';

export function Vault() {
  const records = [
    { id: 'CT-D7K2-01285', result: 'PRESUMPTIVE_POSITIVE', time: '10:42 AM', integrity: 'verified', operator: 'OP-102' },
    { id: 'CT-D7K2-01284', result: 'PRESUMPTIVE_NEGATIVE', time: '09:15 AM', integrity: 'verified', operator: 'OP-102' },
    { id: 'CT-D7K2-01283', result: 'INCONCLUSIVE', time: 'Yesterday', integrity: 'warning', operator: 'OP-087' },
    { id: 'CT-D7K2-01282', result: 'PRESUMPTIVE_NEGATIVE', time: 'Yesterday', integrity: 'verified', operator: 'OP-103' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Evidence Vault</h1>
          <p className="text-muted mt-1">Cryptographic integrity and chain of custody</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="h-11 px-4 bg-surface border border-border rounded-xl flex items-center gap-2 hover:bg-surface-2 transition-colors">
            <Filter className="w-5 h-5 text-text" />
            <span className="font-medium text-sm">Filters</span>
          </button>
          <div className="flex items-center bg-surface border border-border rounded-xl p-1 h-11">
            <button className="px-3 py-1.5 text-sm font-medium bg-surface-2 text-text rounded-lg">Grid</button>
            <button className="px-3 py-1.5 text-sm font-medium text-muted hover:text-text rounded-lg flex items-center gap-1">
              <LinkIcon className="w-4 h-4" /> Chain
            </button>
          </div>
        </div>
      </header>

      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {records.map((record, i) => (
          <div key={i} className={cn(
            "bg-surface border p-4 rounded-[16px] shadow-sm flex flex-col transition-colors",
            record.integrity === 'warning' ? 'border-danger/30 bg-danger/5' : 'border-border hover:border-primary/50'
          )}>
            <div className="w-full h-32 bg-surface-2 rounded-xl mb-4 border border-border flex items-center justify-center">
              {/* Thumbnail placeholder */}
              <div className="w-16 h-10 border-2 border-dashed border-muted/30 rounded flex items-center justify-center">
                <span className="text-[10px] text-muted">IMG</span>
              </div>
            </div>
            
            <div className="flex items-start justify-between mb-2">
              <span className="font-mono text-sm font-semibold text-text">{record.id}</span>
              {record.integrity === 'verified' ? (
                <Shield className="w-4 h-4 text-accent" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-danger" />
              )}
            </div>

            <div className="mt-auto pt-3 border-t border-border/50 flex flex-col gap-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted text-xs">Result</span>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  record.result === 'PRESUMPTIVE_POSITIVE' ? "text-positive" :
                  record.result === 'PRESUMPTIVE_NEGATIVE' ? "text-negative" :
                  "text-inconclusive"
                )}>
                  {record.result.replace('PRESUMPTIVE_', '')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted text-xs">Operator</span>
                <span className="text-text font-medium">{record.operator}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted text-xs">Time</span>
                <span className="text-text font-medium">{record.time}</span>
              </div>
            </div>

            <Link 
              to={`/records/${record.id}`}
              className="mt-4 w-full py-2 bg-surface-2 hover:bg-border border border-border rounded-lg text-sm font-medium text-text text-center transition-colors"
            >
              View Record
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
