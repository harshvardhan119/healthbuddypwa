"use client";

import SplashScreen from "@/components/splash-screen";
import AuthPage from "@/components/auth-page";
import DailyCheckinModal from "@/components/daily-checkin";
import { useHealth } from "@/lib/health-context";
import { useState, useEffect } from "react";
import { 
  Home as HomeIcon, 
  Activity as ActivityIcon, 
  Utensils as UtensilsIcon, 
  User as UserIcon,
  BrainCircuit,
  LayoutDashboard,
  Dumbbell,
  Apple,
  Settings
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { data, isLoaded } = useHealth();
  const [showSplash, setShowSplash] = useState(true);
  const pathname = usePathname();

  const isLandingPage = pathname === "/";

  if (showSplash || !isLoaded) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!data.user?.isAuthenticated && !isLandingPage) {
    return <AuthPage onAuthSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar for Desktop */}
      {data.user.isAuthenticated && !isLandingPage && (
        <aside className="hidden md:flex w-72 flex-col bg-white border-r border-black/5 p-8 h-screen sticky top-0 shrink-0">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <BrainCircuit size={24} />
            </div>
            <h2 className="font-black text-xl tracking-tighter">Health <span className="text-emerald-500">Buddy</span></h2>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarLink href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={pathname === "/dashboard"} />
            <SidebarLink href="/workout" icon={<Dumbbell size={20} />} label="Workout Plan" active={pathname === "/workout"} />
            <SidebarLink href="/diet" icon={<Apple size={20} />} label="Nutrition" active={pathname === "/diet"} />
            <SidebarLink href="/profile" icon={<UserIcon size={20} />} label="My Profile" active={pathname === "/profile"} />
          </nav>

          <div className="mt-auto pt-8 border-t border-black/5">
             <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-3xl">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black">
                   {data.user.name?.[0] || 'B'}
                </div>
                <div className="min-w-0">
                   <p className="font-black text-sm truncate">{data.user.name || 'Buddy'}</p>
                   <p className="text-[10px] font-bold opacity-40 uppercase truncate">Rank: Elite</p>
                </div>
             </div>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto w-full relative ${data.user.isAuthenticated && !isLandingPage ? 'md:bg-slate-50/30' : ''}`}>
        <div className={`mx-auto ${isLandingPage ? 'w-full' : 'max-w-screen-2xl px-4 md:px-12 py-4 md:py-8 pb-32 md:pb-12'}`}>
          {children}
        </div>

        {/* Floating Bottom Nav for Mobile */}
        {data.user.isAuthenticated && !isLandingPage && (
          <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 glass px-8 py-5 rounded-full flex gap-10 items-center z-50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40">
            <NavLink href="/dashboard" icon={<HomeIcon size={20} />} label="Home" active={pathname === "/dashboard"} />
            <NavLink href="/workout" icon={<ActivityIcon size={20} />} label="Move" active={pathname === "/workout"} />
            <NavLink href="/diet" icon={<UtensilsIcon size={20} />} label="Eat" active={pathname === "/diet"} />
            <NavLink href="/profile" icon={<UserIcon size={20} />} label="Me" active={pathname === "/profile"} />
          </nav>
        )}
      </main>

      <DailyCheckinModal />
    </div>
  );
}

function SidebarLink({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-4 px-6 py-4 rounded-[24px] font-black text-sm transition-all relative group">
      {active && (
        <motion.div layoutId="activeSidebar" className="absolute inset-0 bg-emerald-500 shadow-xl shadow-emerald-500/20 rounded-[24px]" />
      )}
      <span className={`relative z-10 transition-colors ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>{icon}</span>
      <span className={`relative z-10 transition-colors ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'}`}>{label}</span>
    </Link>
  );
}

function NavLink({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1 group transition-all">
      <div className={`${active ? 'text-emerald-500 scale-110' : 'text-muted-foreground'} group-hover:text-emerald-500 group-hover:scale-110 transition-all`}>
        {icon}
      </div>
      <span className={`text-[10px] font-black uppercase tracking-tighter ${active ? 'opacity-100 text-emerald-500' : 'opacity-40 group-hover:opacity-100'}`}>
        {label}
      </span>
    </Link>
  );
}
