import { Search, Filter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '../../app/Layout';

export function RecordsList() {
  const records = [
    { id: 'CT-D7K2-01285', sampleRef: 'SR-2026-00412', result: 'PRESUMPTIVE_POSITIVE', kit: 'Demo Kit A', location: 'Bengaluru', time: 'Today 10:42 AM', operator: 'OP-102' },
    { id: 'CT-D7K2-01284', sampleRef: 'SR-2026-00411', result: 'PRESUMPTIVE_NEGATIVE', kit: 'Demo Kit A', location: 'Bengaluru', time: 'Today 09:15 AM', operator: 'OP-102' },
    { id: 'CT-D7K2-01283', sampleRef: 'SR-2026-00410', result: 'INCONCLUSIVE', kit: 'Demo Kit B', location: 'Mysuru', time: 'Yesterday', operator: 'OP-087' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Test Records</h1>
          <p className="text-muted mt-1">Search and filter sealed field evidence</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Search ID, sample, operator..." 
              className="w-full h-11 bg-surface border border-border rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
          </div>
          <button className="h-11 px-4 bg-surface border border-border rounded-xl flex items-center gap-2 hover:bg-surface-2 transition-colors">
            <Filter className="w-5 h-5 text-text" />
            <span className="hidden md:inline font-medium text-sm">Filters</span>
          </button>
        </div>
      </header>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-surface border border-border rounded-[16px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-2/50 text-xs uppercase tracking-wider text-muted font-medium">
              <th className="p-4 font-medium">Test ID</th>
              <th className="p-4 font-medium">Sample Ref</th>
              <th className="p-4 font-medium">Result</th>
              <th className="p-4 font-medium">Kit</th>
              <th className="p-4 font-medium">Location</th>
              <th className="p-4 font-medium">Time</th>
              <th className="p-4 font-medium">Operator</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {records.map((row, i) => (
              <tr key={i} className="hover:bg-surface-2 transition-colors group">
                <td className="p-4">
                  <Link to={`/records/${row.id}`} className="font-mono text-sm text-text font-medium group-hover:text-primary transition-colors">
                    {row.id}
                  </Link>
                </td>
                <td className="p-4 text-sm text-muted">{row.sampleRef}</td>
                <td className="p-4">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border",
                    row.result === 'PRESUMPTIVE_POSITIVE' ? "bg-positive/10 text-positive border-positive/20" :
                    row.result === 'PRESUMPTIVE_NEGATIVE' ? "bg-negative/10 text-negative border-negative/20" :
                    "bg-inconclusive/10 text-inconclusive border-inconclusive/20"
                  )}>
                    {row.result.replace('PRESUMPTIVE_', '')}
                  </span>
                </td>
                <td className="p-4 text-sm text-muted">{row.kit}</td>
                <td className="p-4 text-sm text-muted">{row.location}</td>
                <td className="p-4 text-sm text-muted">{row.time}</td>
                <td className="p-4 text-sm text-muted">
                  <span className="bg-surface-2 px-2 py-1 rounded text-xs border border-border/50">{row.operator}</span>
                </td>
                <td className="p-4 text-right">
                  <Link to={`/records/${row.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-border transition-colors text-muted hover:text-text">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {records.map((row, i) => (
          <Link key={i} to={`/records/${row.id}`} className="block bg-surface border border-border rounded-[16px] p-4 shadow-sm hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-sm font-semibold text-text">{row.id}</span>
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                row.result === 'PRESUMPTIVE_POSITIVE' ? "bg-positive/10 text-positive border-positive/20" :
                row.result === 'PRESUMPTIVE_NEGATIVE' ? "bg-negative/10 text-negative border-negative/20" :
                "bg-inconclusive/10 text-inconclusive border-inconclusive/20"
              )}>
                {row.result.replace('PRESUMPTIVE_', '')}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div>
                <p className="text-xs text-muted">Sample</p>
                <p className="font-medium text-text">{row.sampleRef}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Kit</p>
                <p className="text-text">{row.kit}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Time</p>
                <p className="text-text">{row.time}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Location</p>
                <p className="text-text truncate">{row.location}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
