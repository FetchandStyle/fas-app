'use client';

import { useState } from 'react';
import AppTopNav from '@/components/app/AppTopNav';
import AccountSidebar from '@/components/app/AccountSidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <AppTopNav
        onMenuClick={() => setMobileNavOpen(true)}
        showMenuButton
      />
      <div className="flex flex-1">
        <AccountSidebar
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
        />
        <div className="min-w-0 flex-1 bg-[#F4F5F4]">{children}</div>
      </div>
    </div>
  );
}
