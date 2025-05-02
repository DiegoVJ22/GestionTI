'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incidentes',
        href: '/incidents',
    },
];

// Añadir estos tipos arriba del componente
type ChartData = {
    name: string;
    value: number;
    fill?: string;
};

type TimeGroup = 'year' | 'month' | 'day';

// const chartConfig1 = {
//     visitors: {
//         label: 'Visitors',
//     },
//     chrome: {
//         label: 'Chrome',
//         color: 'var(--primary)',
//     },
//     safari: {
//         label: 'Safari',
//         color: 'var(--secondary)',
//     },
// } satisfies ChartConfig;

// const chartConfig2 = {
//     desktop: {
//         label: 'Desktop',
//         color: 'var(--primary)',
//     },
// } satisfies ChartConfig;

// Definimos el tipo Incident
export type Incident = {
    id: number;
    title: string;
    priority: 'Alta' | 'Media' | 'Baja';
    status: 'Abierto' | 'En progreso' | 'Cerrado';
    service: {
        name: string;
        status: string;
    };
    sla_deadline: string | null;
    resolved_at: string | null;
    created_at: string;
    solutions_count?: number;
    steps?: string; // Nuevo campo
};

// Columnas ajustadas para incidentes
export const columns: ColumnDef<Incident>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'title',
        header: 'Título',
        cell: ({ row }) => <div className="font-medium">{row.getValue('title')}</div>,
    },
    {
        accessorKey: 'priority',
        header: 'Prioridad',
        cell: ({ row }) => {
            const priority = row.getValue('priority') as string;
            return (
                <div className="flex items-center gap-2">
                    <div
                        className={`h-2 w-2 rounded-full ${priority === 'Alta' ? 'bg-red-500' : priority === 'Media' ? 'bg-yellow-500' : 'bg-green-500'}`}
                    />
                    <span className="capitalize">{priority}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => {
            const status = row.getValue('status') as 'Abierto' | 'En progreso' | 'Cerrado';
            const statusStyles: Record<'Abierto' | 'En progreso' | 'Cerrado', string> = {
                Abierto: 'bg-blue-100 text-blue-800',
                'En progreso': 'bg-yellow-100 text-yellow-800',
                Cerrado: 'bg-green-100 text-green-800',
            };
            return <span className={`rounded-md px-2 py-1 text-sm capitalize ${statusStyles[status]}`}>{status}</span>;
        },
    },
    {
        accessorKey: 'service.name',
        header: 'Servicio',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <span>{row.original.service?.name}</span>
                <span
                    className={`h-2 w-2 rounded-full ${
                        row.original.service?.status === 'Operativo'
                            ? 'bg-green-500'
                            : row.original.service?.status === 'Inestable'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                    }`}
                />
            </div>
        ),
    },
    {
        accessorKey: 'steps',
        header: 'Solución',
        cell: ({ row }) => {
            const steps = row.original.steps;
            const copyToClipboard = () => {
                navigator.clipboard.writeText(steps || '');
            };

            return (
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button variant="link" className="h-auto max-w-[300px] truncate p-0 text-left text-sm font-normal" disabled={!steps}>
                            Ver
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[80vh]">
                        <div className="mx-auto w-full max-w-2xl">
                            <DrawerHeader>
                                <DrawerTitle className="flex items-center gap-2">
                                    <span>Pasos de solución</span>
                                    <span className="text-muted-foreground text-sm font-normal">({row.original.title})</span>
                                </DrawerTitle>
                                <DrawerDescription>Procedimiento detallado para resolver el incidente</DrawerDescription>
                            </DrawerHeader>

                            <div className="p-4 pb-0">
                                <div className="bg-accent/50 rounded-lg p-4">
                                    <pre className="font-sans whitespace-pre-wrap">
                                        {steps?.split('\n').map((step, index) => (
                                            <div key={index} className="mb-2 last:mb-0">
                                                {step}
                                            </div>
                                        )) || 'No se han registrado pasos de solución'}
                                    </pre>
                                </div>
                            </div>

                            <DrawerFooter className="pt-4">
                                <div className="flex gap-2">
                                    <Button onClick={copyToClipboard} variant="secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M9 18q-.825 0-1.412-.587Q7 16.825 7 16V4q0-.825.588-1.413Q8.175 2 9 2h9q.825 0 1.413.587Q20 3.175 20 4v12q0 .825-.587 1.413Q18.825 18 18 18Zm0-2h9V4H9v12Zm-4 6q-.825 0-1.412-.587Q3 20.825 3 20V7q0-.425.288-.713Q3.575 6 4 6t.713.287Q5 6.575 5 7v13h10q.425 0 .713.288q.287.287.287.712t-.287.712Q15.425 22 15 22ZM9 4v12V4Z"
                                            />
                                        </svg>
                                        Copiar pasos
                                    </Button>
                                    <DrawerClose asChild>
                                        <Button variant="outline">Cerrar</Button>
                                    </DrawerClose>
                                </div>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            );
        },
    },
    {
        accessorKey: 'sla_deadline',
        header: 'Fecha Límite SLA',
        cell: ({ row }) => (
            <div className="text-sm">{row.getValue('sla_deadline') ? new Date(row.getValue('sla_deadline')).toLocaleDateString() : 'N/A'}</div>
        ),
    },
    {
        accessorKey: 'resolved_at',
        header: 'Resuelto en',
        cell: ({ row }) => (
            <div className="text-sm">{row.getValue('resolved_at') ? new Date(row.getValue('resolved_at')).toLocaleDateString() : 'Pendiente'}</div>
        ),
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const incident = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(incident.id.toString())}>Copiar ID</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                        <DropdownMenuItem>Editar incidencia</DropdownMenuItem>
                        <DropdownMenuItem>Marcar como resuelto</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default function IndexIncidente({
    incidents,
    filters,
    years,
}: {
    incidents: Incident[];
    filters: { [key: string]: string };
    years: number[];
}) {
    // Estados para los filtros
    const [priority, setPriority] = React.useState(filters.priority || 'all');
    const [status, setStatus] = React.useState(filters.status || 'all');
    const [month, setMonth] = React.useState(filters.month || 'all');
    const [year, setYear] = React.useState(filters.year || 'all');
    // Función para aplicar filtros
    const applyFilters = () => {
        router.get('/incidents', {
            priority: priority !== 'all' ? priority : null,
            status: status !== 'all' ? status : null,
            month: month !== 'all' ? month : null,
            year: year !== 'all' ? year : null,
        });
    };

    // Resetear filtros
    const resetFilters = () => {
        setPriority('all');
        setStatus('all');
        setMonth('all');
        setYear('all');
        router.get('/incidents');
    };

    // Generar opciones de meses
    const months = [
        { value: 'all', label: 'Todos los meses' },
        { value: '1', label: 'Enero' },
        { value: '2', label: 'Febrero' },
        { value: '3', label: 'Marzo' },
        { value: '4', label: 'Abril' },
        { value: '5', label: 'Mayo' },
        { value: '6', label: 'Junio' },
        { value: '7', label: 'Julio' },
        { value: '8', label: 'Agosto' },
        { value: '9', label: 'Setiembre' },
        { value: '10', label: 'Octubre' },
        { value: '11', label: 'Noviembre' },
        { value: '12', label: 'Diciembre' },
    ];

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data: incidents,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    // Datos para gráfico de barras
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

    // Datos para gráfico circular
    const pieChartData = React.useMemo<ChartData[]>(() => {
        if (priority !== 'all') {
            return [
                {
                    name: priority,
                    value: incidents.length,
                    fill: priority === 'Alta' ? '#ef4444' : priority === 'Media' ? '#eab308' : '#22c55e',
                },
            ];
        }

        const priorities: ChartData[] = [
            { name: 'Alta', value: 0, fill: '#ef4444' },
            { name: 'Media', value: 0, fill: '#eab308' },
            { name: 'Baja', value: 0, fill: '#22c55e' },
        ];

        incidents.forEach((incident) => {
            const index = priorities.findIndex((p) => p.name === incident.priority);
            if (index >= 0) {
                priorities[index].value++;
            }
        });

        return priorities.filter((p) => p.value > 0);
    }, [incidents, priority]);

    // Configuración dinámica de gráficos
    const barChartConfig = {
        value: {
            label: 'Incidentes',
            color: 'var(--primary)',
        },
    } satisfies ChartConfig;

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

    // Texto central del gráfico circular
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Incidentes" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-wrap gap-2">
                    <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las prioridades</SelectItem>
                            <SelectItem value="Alta">Alta</SelectItem>
                            <SelectItem value="Media">Media</SelectItem>
                            <SelectItem value="Baja">Baja</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            <SelectItem value="Abierto">Abierto</SelectItem>
                            <SelectItem value="En progreso">En progreso</SelectItem>
                            <SelectItem value="Cerrado">Cerrado</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={month} onValueChange={setMonth}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Mes" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((m) => (
                                <SelectItem key={m.value} value={m.value}>
                                    {m.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Año" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los años</SelectItem>
                            {years.map((y) => (
                                <SelectItem key={y} value={y.toString()}>
                                    {y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button onClick={applyFilters}>Aplicar</Button>
                    <Button variant="outline" onClick={resetFilters}>
                        Limpiar
                    </Button>
                    <Button variant="outline">Registrar</Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[2fr_1fr]">
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

                    <Card className="h-full">
                        <CardHeader className="pb-0">
                            <CardTitle>Distribución por prioridad</CardTitle>
                            <CardDescription>Proporción de incidentes por nivel de prioridad</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[250px]">
                                <PieChart>
                                    <Pie data={pieChartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} paddingAngle={2}>
                                        <Label
                                            position="center"
                                            content={() => (
                                                <text textAnchor="middle" dominantBaseline="middle">
                                                    {pieChartCenterText}
                                                </text>
                                            )}
                                        />
                                    </Pie>
                                    // Gráfico circular
                                    <ChartTooltip
                                        content={({ payload }) => {
                                            if (!payload || payload.length === 0) return null;

                                            return (
                                                <div className="bg-background rounded-md border p-2 shadow-md">
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
                </div>
                <div className="w-full">
                    <div className="flex items-center py-4">
                        <Input
                            placeholder="Filtrar por título..."
                            value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
                            onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
                            className="max-w-sm"
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Columns <ChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="text-muted-foreground flex-1 text-sm">
                            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                        </div>
                        <div className="space-x-2">
                            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                                Previous
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
