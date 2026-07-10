'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AppTopNav from '@/components/app/AppTopNav';
import AccountSidebar from '@/components/app/AccountSidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isRoomBuilder = pathname.startsWith('/room-builder');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [desktopNavCollapsed, setDesktopNavCollapsed] = useState(false);

  useEffect(() => {
    setDesktopNavCollapsed(isRoomBuilder);
  }, [isRoomBuilder]);

  return (
    <div
      className={`flex flex-col ${isRoomBuilder ? 'h-screen overflow-hidden' : 'min-h-screen'}`}
    >
      <AppTopNav
        onMenuClick={() => setMobileNavOpen(true)}
        showMenuButton
      />
      <div className={`relative flex flex-1 ${isRoomBuilder ? 'min-h-0 overflow-hidden' : ''}`}>
        <AccountSidebar
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
          desktopCollapsed={desktopNavCollapsed}
          onDesktopToggle={() => setDesktopNavCollapsed((v) => !v)}
          showDesktopToggle={isRoomBuilder}
        />
        <div
          className={`min-w-0 flex-1 bg-[#F4F5F4] ${isRoomBuilder ? 'h-full overflow-hidden' : ''}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
