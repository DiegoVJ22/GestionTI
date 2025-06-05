import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/shadcn/appearance-tabs';
import HeadingSmall from '@/components/shadcn/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Apariencia',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Apariencia" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Apariencia" description="Actualiza la apariencia de tu interfaz aquí" />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
