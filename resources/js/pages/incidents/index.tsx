'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
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
import { ChevronDown, MoreHorizontal, TrendingUp } from 'lucide-react';
import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import { DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incidentes',
        href: '/incidents',
    },
];

const chartData1 = [
    { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
    { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
];
const chartConfig1 = {
    visitors: {
        label: 'Visitors',
    },
    chrome: {
        label: 'Chrome',
        color: 'var(--primary)',
    },
    safari: {
        label: 'Safari',
        color: 'var(--secondary)',
    },
} satisfies ChartConfig;

const chartData2 = [
    { month: '1', desktop: 186 },
    { month: '2', desktop: 305 },
    { month: '3', desktop: 237 },
    { month: '4', desktop: 73 },
    { month: '5', desktop: 209 },
    { month: '6', desktop: 214 },
    { month: '1', desktop: 186 },
    { month: '2', desktop: 305 },
    { month: '3', desktop: 237 },
    { month: '4', desktop: 73 },
    { month: '5', desktop: 209 },
    { month: '6', desktop: 214 },
    { month: '1', desktop: 186 },
    { month: '2', desktop: 305 },
    { month: '3', desktop: 237 },
    { month: '4', desktop: 73 },
    { month: '5', desktop: 209 },
    { month: '6', desktop: 214 },
    { month: '1', desktop: 186 },
    { month: '2', desktop: 305 },
    { month: '3', desktop: 237 },
    { month: '4', desktop: 73 },
    { month: '5', desktop: 209 },
    { month: '6', desktop: 214 },
    { month: '1', desktop: 186 },
    { month: '2', desktop: 305 },
    { month: '3', desktop: 237 },
    { month: '4', desktop: 73 },
    { month: '5', desktop: 209 },
    { month: '6', desktop: 214 },
];
const chartConfig2 = {
    desktop: {
        label: 'Desktop',
        color: 'var(--primary)',
    },
} satisfies ChartConfig;

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

export default function IndexIncidente({ incidents }: { incidents: Incident[] }) {
    const totalVisitors = React.useMemo(() => {
        return chartData1.reduce((acc, curr) => acc + curr.visitors, 0);
    }, []);
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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Incidentes" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex">
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Todos los meses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">Todos los meses</SelectItem>
                            <SelectItem value="1">Enero</SelectItem>
                            <SelectItem value="2">Febreo</SelectItem>
                            <SelectItem value="3">Marzo</SelectItem>
                            <SelectItem value="4">Abril</SelectItem>
                            <SelectItem value="5">Mayo</SelectItem>
                            <SelectItem value="6">Junio</SelectItem>
                            <SelectItem value="7">Julio</SelectItem>
                            <SelectItem value="8">Agosto</SelectItem>
                            <SelectItem value="9">Setiembre</SelectItem>
                            <SelectItem value="10">Octubre</SelectItem>
                            <SelectItem value="11">Noviembre</SelectItem>
                            <SelectItem value="12">Diciembre</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline">Registrar</Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Bar Chart</CardTitle>
                                <CardDescription>January - June 2024</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig2}>
                                    <BarChart accessibilityLayer data={chartData2}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                            tickFormatter={(value) => value.slice(0, 3)}
                                        />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-2 text-sm">
                                <div className="flex gap-2 leading-none font-medium">
                                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
                            </CardFooter>
                        </Card>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                        <Card className="flex flex-col">
                            <CardHeader className="items-center pb-0">
                                <CardTitle>Pie Chart - Donut with Text</CardTitle>
                                <CardDescription>January - June 2024</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 pb-0">
                                <ChartContainer config={chartConfig1} className="mx-auto aspect-square max-h-[250px]">
                                    <PieChart>
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                        <Pie data={chartData1} dataKey="visitors" nameKey="browser" innerRadius={60} strokeWidth={5}>
                                            <Label
                                                content={({ viewBox }) => {
                                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                                        return (
                                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                                    {totalVisitors.toLocaleString()}
                                                                </tspan>
                                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                                                    Visitors
                                                                </tspan>
                                                            </text>
                                                        );
                                                    }
                                                }}
                                            />
                                        </Pie>
                                    </PieChart>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter className="flex-col gap-2 text-sm">
                                <div className="flex items-center gap-2 leading-none font-medium">
                                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
                            </CardFooter>
                        </Card>
                    </div>
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
