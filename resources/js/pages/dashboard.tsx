import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { AlertCircle, ServerCrash, ShieldCheck } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function Dashboard() {
    const { totalIncidentsThisMonth, activeServices, criticalServices, operationalServices } = usePage<{
        totalIncidentsThisMonth: number;
        activeServices: number;
        criticalServices: number;
        operationalServices: number;
        stableServices: number;
    }>().props;

    const { criticalServicesByMonth } = usePage<{
        criticalServicesByMonth: { month: string; count: number }[];
    }>().props;

    const chartData = [
        { month: 'January', incidents: 10 },
        { month: 'February', incidents: 15 },
        { month: 'March', incidents: 8 },
        { month: 'April', incidents: 12 },
        { month: 'May', incidents: 20 },
        { month: 'June', incidents: 18 },
        { month: 'July', incidents: 25 },
        { month: 'August', incidents: 22 },
        { month: 'September', incidents: 19 },
        { month: 'October', incidents: 14 },
        { month: 'November', incidents: 16 },
        { month: 'December', incidents: 10 },
    ];

    const cards = [
        {
            title: 'Total Incidents This Month',
            value: totalIncidentsThisMonth,
            icon: <AlertCircle className="h-6 w-6 text-red-500" />,
        },
        {
            title: 'Critical Services',
            value: criticalServices,
            icon: <ServerCrash className="h-6 w-6 text-orange-500" />,
        },
        {
            title: 'Operational Services',
            value: operationalServices,
            icon: <ShieldCheck className="h-6 w-6 text-green-500" />,
        },
    ];

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total incidentes este mes</CardTitle>
                    </CardHeader>
                </Card>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {cards.map((card, idx) => (
                        <Card key={idx} className="h-[20rem] bg-black">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-muted-foreground text-sm font-medium">{card.title}</CardTitle>
                                {card.icon}
                            </CardHeader>
                            <CardContent>
                                <div className="text-[96px] font-bold">{card.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle>Servicios Críticos por Mes (Año Actual)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={criticalServicesByMonth}>
                                <XAxis dataKey="month" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
