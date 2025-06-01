import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Incident } from '@/types/incident';
import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

type ChartData = {
    name: string;
    value: number;
    fill?: string;
};

type TimeGroup = 'year' | 'month' | 'day';

type IncidentBarChartProps = {
    incidents: Incident[];
    month: string;
    year: string;
    months: { value: string; label: string }[];
};

export function IncidentBarChart({ incidents, month, year, months }: IncidentBarChartProps) {
    const barChartData = React.useMemo(() => {
        const timeGroup: TimeGroup = year === 'all' && month === 'all' ? 'year' : year !== 'all' && month === 'all' ? 'month' : 'day';

        const dataMap = new Map<string, number>();

        incidents.forEach((incident) => {
            const date = new Date(incident.created_at);
            let key: string;

            switch (timeGroup) {
                case 'year':
                    key = `${date.getFullYear()}`;
                    break;
                case 'month':
                    key = `${date.getMonth() + 1}`;
                    break;
                case 'day':
                    key = `${date.getDate()}`;
                    break;
            }

            dataMap.set(key, (dataMap.get(key) || 0) + 1);
        });

        // Generar rango completo de fechas
        const now = new Date();
        const labels =
            timeGroup === 'month'
                ? Array.from({ length: 12 }, (_, i) => i + 1)
                : timeGroup === 'day'
                  ? Array.from({ length: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() }, (_, i) => i + 1)
                  : Array.from(new Set(incidents.map((i) => new Date(i.created_at).getFullYear())));

        return labels.map((label) => ({
            name: `${label}`,
            value: dataMap.get(`${label}`) || 0,
        }));
    }, [incidents, month, year]);

    const barChartConfig = {
        value: {
            label: 'Incidentes',
            color: 'var(--primary)',
        },
    } satisfies ChartConfig;

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {year === 'all'
                        ? 'Incidentes por ' + (month === 'all' ? 'mes (todos los años)' : 'día')
                        : month === 'all'
                          ? `Incidentes por mes (${year})`
                          : `Incidentes por día (${months[Number(month) - 1]?.label} ${year})`}
                </CardTitle>
                <CardDescription>Distribución temporal de incidentes</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={barChartConfig}>
                    <BarChart data={barChartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickFormatter={(value) => {
                                if (month !== 'all' && year !== 'all') return value;
                                return months[Number(value) - 1]?.label.slice(0, 3) || value;
                            }}
                        />
                        <ChartTooltip
                            content={({ active, payload }) => {
                                if (!active || !payload || payload.length === 0) return null;

                                return (
                                    <div className="bg-background rounded-md border p-2 shadow-md">
                                        <div className="font-medium">{payload[0].payload.name}</div>
                                        <div className="text-muted-foreground text-sm">Incidentes: {payload[0].value}</div>
                                    </div>
                                );
                            }}
                        />
                        <Bar dataKey="value" fill="var(--primary)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
