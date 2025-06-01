import { AppContent } from '@/components/shadcn/app-content';
import { AppShell } from '@/components/shadcn/app-shell';
import { AppSidebar } from '@/components/shadcn/app-sidebar';
import { AppSidebarHeader } from '@/components/shadcn/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
