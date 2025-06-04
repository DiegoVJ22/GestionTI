import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Incident } from '@/types/incident';
import * as React from 'react';
import { Label, Pie, PieChart, Cell } from 'recharts';

type ChartData = {
    name: string;
    value: number;
    fill?: string;
};

type IncidentPieChartProps = {
    incidents: Incident[];
    priority: string;
    PRIORITY_COLORS: Record<string, string>;
};

export function IncidentPieChart({ incidents, priority, PRIORITY_COLORS}: IncidentPieChartProps) {
    const pieChartData = React.useMemo<ChartData[]>(() => {
        if (priority !== 'all') {
            return [
                {
                    name: priority,
                    value: incidents.length,
                    fill: PRIORITY_COLORS[priority]?.replace('bg-', '#'), // Convert Tailwind class to hex color
                },
            ];
        }

        const priorities: ChartData[] = [
            { name: 'Alta', value: 0, fill: PRIORITY_COLORS['Alta']?.replace('bg-', '#') },
            { name: 'Media', value: 0, fill: PRIORITY_COLORS['Media']?.replace('bg-', '#') },
            { name: 'Baja', value: 0, fill: PRIORITY_COLORS['Baja']?.replace('bg-', '#') },
        ];

        incidents.forEach((incident) => {
            const index = priorities.findIndex((p) => p.name === incident.priority);
            if (index >= 0) {
                priorities[index].value++;
            }
        });

        return priorities.filter((p) => p.value > 0);
    }, [incidents, priority, PRIORITY_COLORS]);

    const pieChartConfig = {
        ...pieChartData.reduce(
            (acc, curr) => ({
                ...acc,
                [curr.name]: {
                    label: curr.name,
                    color: curr.fill,
                },
            }),
            {},
        ),
    } satisfies ChartConfig;

    const pieChartCenterText = (
        <>
            <tspan x="50%" dy="0" className="fill-foreground text-3xl font-bold">
                {incidents.length}
            </tspan>
            <tspan x="50%" dy="24" className="fill-muted-foreground text-sm">
                {priority !== 'all' ? priority : 'Total'}
            </tspan>
        </>
    );

    return (
        <Card className="h-full">
            <CardHeader className="pb-0">
                <CardTitle>Distribución por prioridad</CardTitle>
                <CardDescription>Proporción de incidentes por nivel de prioridad</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <PieChart width={250} height={250}>
                        <Pie 
                            data={pieChartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            cx="50%" 
                            cy="50%"
                            >
                            <Label
                                position="center"
                                content={() => (
                                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                                        {pieChartCenterText}
                                    </text>
                                )}
                            />
                            {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        {/* Gráfico circular */}
                        <ChartTooltip
                            content={({ payload }) => {
                                if (!payload || payload.length === 0) return null;

                                return (
                                    <div className="bg-background rounded-md border pl-2 pr-2 pb-2 shadow-md">
                                        <div className="flex items-center gap-2">
                                            {payload[0].payload.fill && (
                                                <div
                                                    className="h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: payload[0].payload.fill }}
                                                />
                                            )}
                                            <span className="font-medium">{payload[0].name}:</span>
                                            <span>{payload[0].value}</span>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
