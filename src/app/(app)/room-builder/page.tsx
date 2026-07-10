import { Suspense } from 'react';
import RoomBuilderClient from '@/components/room-builder/RoomBuilderClient';

function RoomBuilderFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F3F4F6] border-t-[#658EC2]" />
    </div>
  );
}

export default function RoomBuilderPage() {
  return (
    <Suspense fallback={<RoomBuilderFallback />}>
      <RoomBuilderClient />
    </Suspense>
  );
}
