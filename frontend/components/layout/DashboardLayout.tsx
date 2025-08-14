'use client';

import { PropsWithChildren } from 'react';
import Layout from './Layout';
import AuthGuard from '../auth/AuthGuard';

interface DashboardLayoutProps extends PropsWithChildren {
  allowedRoles?: string[];
}

export default function DashboardLayout({ children, allowedRoles }: DashboardLayoutProps) {
  return (
    <AuthGuard allowedRoles={allowedRoles}>
      <Layout>
        {children}
      </Layout>
    </AuthGuard>
  );
}
