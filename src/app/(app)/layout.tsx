import AppTopNav from '@/components/app/AppTopNav';
import AccountSidebar from '@/components/app/AccountSidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppTopNav />
      <div className="flex flex-1">
        <AccountSidebar />
        <div className="min-w-0 flex-1 bg-gray-50">{children}</div>
      </div>
    </div>
  );
}
