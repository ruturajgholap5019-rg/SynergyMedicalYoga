import React, { Suspense } from 'react';

const AdminApp = React.lazy(() => import('../../../admin/src/AdminApp.jsx'));

export default function AdminPortalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center text-sm font-bold text-slate-600">Loading admin portal...</div>}>
      <AdminApp />
    </Suspense>
  );
}
