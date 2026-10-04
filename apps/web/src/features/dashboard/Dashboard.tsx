import { Activity, Beaker, ShieldCheck, FileWarning, ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '../../app/Layout';

export function Dashboard() {
  const kpis = [
    { label: 'Total tests', value: '1,284', icon: Activity, color: 'text-primary' },
    { label: 'Today', value: '14', icon: Beaker, color: 'text-accent' },
    { label: 'Presumptive +ve', value: '3', icon: ShieldCheck, color: 'text-positive' },
    { label: 'Inconclusive', value: '2', icon: FileWarning, color: 'text-inconclusive' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Welcome back, Vikas</h1>
          <p className="text-muted mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-positive"></span>
            IST {new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <Link 
          to="/new-test" 
          className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary/25"
        >
          <Beaker className="w-5 h-5" />
          Start New Test
        </Link>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-surface border border-border p-5 rounded-[16px] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-2 rounded-lg bg-surface-2", kpi.color)}>
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold text-text">{kpi.value}</h3>
              <p className="text-sm font-medium text-muted">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Ledger Integrity */}
        <div className="lg:col-span-1 bg-surface border border-border p-6 rounded-[16px] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-surface-2 text-accent">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-text">Ledger Integrity</h2>
          </div>
          
          <div className="flex items-end gap-2 mb-6">
            <span className="text-4xl font-bold text-text">152</span>
            <span className="text-muted mb-1">/ 152 verified</span>
          </div>
          
          <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-accent rounded-full w-full" />
          </div>

          <button className="w-full flex items-center justify-center gap-2 h-11 bg-surface-2 hover:bg-border text-text rounded-xl font-medium transition-colors border border-border">
            <RefreshCw className="w-4 h-4" />
            Run ledger check
          </button>
        </div>

        {/* Recent Tests */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-[16px] shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text">Recent Tests</h2>
            <Link to="/records" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-2/50 text-xs uppercase tracking-wider text-muted font-medium">
                  <th className="p-4 font-medium">Test ID</th>
                  <th className="p-4 font-medium">Result</th>
                  <th className="p-4 font-medium">Kit</th>
                  <th className="p-4 font-medium hidden sm:table-cell">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { id: 'CT-D7K2-01285', result: 'PRESUMPTIVE_POSITIVE', kit: 'Demo Kit A', time: '10:42 AM' },
                  { id: 'CT-D7K2-01284', result: 'PRESUMPTIVE_NEGATIVE', kit: 'Demo Kit A', time: '09:15 AM' },
                  { id: 'CT-D7K2-01283', result: 'INCONCLUSIVE', kit: 'Demo Kit B', time: 'Yesterday' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-surface-2 transition-colors cursor-pointer group">
                    <td className="p-4">
                      <span className="font-mono text-sm text-text font-medium group-hover:text-primary transition-colors">{row.id}</span>
                    </td>
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
                    <td className="p-4 text-sm text-muted hidden sm:table-cell">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
