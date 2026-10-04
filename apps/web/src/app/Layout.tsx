import { Outlet, NavLink } from 'react-router';
import { Home, FileText, PlusCircle, Shield, MoreHorizontal } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Home', to: '/', icon: Home },
  { name: 'Records', to: '/records', icon: FileText },
  { name: 'New Test', to: '/new-test', icon: PlusCircle, isPrimary: true },
  { name: 'Vault', to: '/vault', icon: Shield },
  { name: 'More', to: '/settings', icon: MoreHorizontal },
];

export function Layout() {
  return (
    <div className="flex h-[100dvh] flex-col md:flex-row w-full overflow-hidden">
      {/* Desktop Sidebar (hidden on mobile, rail on tablet, sidebar on desktop) */}
      <aside className="hidden md:flex md:w-[80px] lg:w-[260px] flex-col border-r border-border bg-surface shrink-0">
        <div className="p-4 flex items-center justify-center lg:justify-start">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0">C</div>
          <span className="ml-3 font-semibold hidden lg:block text-lg">ChromaSeal</span>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl transition-colors',
                  isActive ? 'bg-surface-2 text-primary' : 'text-muted hover:bg-surface-2 hover:text-text',
                  item.isPrimary && 'bg-primary text-white hover:bg-primary/90 hover:text-white'
                )
              }
            >
              <item.icon className="w-6 h-6 shrink-0" />
              <span className="hidden lg:block font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-bg relative">
        {/* Top App Bar (Mobile) */}
        <header className="md:hidden flex items-center justify-between h-14 px-4 bg-surface border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">C</div>
            <span className="font-semibold">ChromaSeal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-positive"></div>
            <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-sm font-medium">OP</div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Bottom Tab Bar (Mobile) */}
      <nav className="md:hidden flex items-center justify-around h-16 bg-surface border-t border-border shrink-0 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
                isActive ? 'text-primary' : 'text-muted',
                item.isPrimary && '-mt-5'
              )
            }
          >
            {item.isPrimary ? (
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                <item.icon className="w-6 h-6" />
              </div>
            ) : (
              <>
                <item.icon className="w-6 h-6" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
