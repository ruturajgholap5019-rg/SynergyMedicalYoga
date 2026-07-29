import React, { Suspense } from 'react';

const AdminApp = React.lazy(() => import('../../../admin/src/AdminApp.jsx'));

export default function AdminPortalPage({ currentUser, onAuthSuccess, onLogout }) {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center text-sm font-bold text-slate-600">Loading admin portal...</div>}>
      <AdminApp
        initialUser={currentUser}
        onAuthSuccess={onAuthSuccess}
        onLogout={onLogout}
      />
    </Suspense>
  );
}
