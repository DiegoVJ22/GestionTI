'use client';

import { IncidentBarChart } from '@/components/incidents/IncidentBarChart';
import { IncidentFilters } from '@/components/incidents/IncidentFilters';
import { IncidentPieChart } from '@/components/incidents/IncidentPieChart';
import { IncidentSolutionDrawer } from '@/components/incidents/IncidentSolutionDrawer';
import { IncidentsTable } from '@/components/incidents/IncidentsTable';
import { RegisterIncidentDialog } from '@/components/incidents/RegisterIncidentDialog';
import { Button } from '@/components/ui/button';
import { ChartConfig } from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Incident } from '@/types/incident';
import { Service } from '@/types/service';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import * as React from 'react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incidentes',
        href: '/incidents',
    },
];

type ChartData = {
    name: string;
    value: number;
    fill?: string;
};

type TimeGroup = 'year' | 'month' | 'day';

export type IncidentFormData = {
    title: string;
    description: string;
    service_id: string;
    category: string;
};

const PRIORITY_COLORS: Record<string, string> = {
    Alta: '#ef4444',
    Media: '#eab308',
    Baja: '#22c55e',
};

const STATUS_STYLES: Record<'Abierto' | 'En Proceso' | 'Cerrado', string> = {
    Abierto: 'w-32 bg-blue-200 text-blue-900 border border-blue-300 font-medium rounded-full px-3 py-1 text-sm text-center',
    'En Proceso': 'w-32 bg-yellow-200 text-yellow-900 border border-yellow-300 font-medium rounded-full px-3 py-1 text-sm text-center',
    Cerrado: 'w-32 bg-green-200 text-green-900 border border-green-300 font-medium rounded-full px-3 py-1 text-sm text-center',
};

const SERVICE_STATUS_COLORS: Record<string, string> = {
    Operativo: 'bg-green-500',
    Inestable: 'bg-yellow-500',
    Crítico: 'bg-red-500',
};

export default function IndexIncidente({
    incidents: initialIncidents,
    filters,
    years,
}: {
    incidents: Incident[];
    filters: { [key: string]: string };
    years: number[];
}) {
    const { delete: destroy } = useForm();
    // Estado local para los incidentes
    const [incidents, setIncidents] = React.useState<Incident[]>(initialIncidents);

    // Actualizar incidentes cuando cambian los props iniciales
    React.useEffect(() => {
        setIncidents(initialIncidents);
    }, [initialIncidents]);

    // Función para actualizar el estado de un incidente
    const updateIncidentStatus = (id: number, newStatus: 'Abierto' | 'En Proceso' | 'Cerrado') => {
        setIncidents((prevIncidents) => prevIncidents.map((incident) => (incident.id === id ? { ...incident, status: newStatus } : incident)));
    };

    // Columnas ajustadas para incidentes
    const columns: ColumnDef<Incident>[] = React.useMemo(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
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
                            <div className={`h-2 w-2 rounded-full ${PRIORITY_COLORS[priority]}`} />
                            <span className="capitalize">{priority}</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'status',
                header: 'Estado',
                cell: ({ row }) => {
                    const status = row.getValue('status') as 'Abierto' | 'En Proceso' | 'Cerrado';
                    return (
                        <span className={`min-w-[110px] rounded-md px-2 py-1 text-center text-sm capitalize ${STATUS_STYLES[status]}`}>{status}</span>
                    );
                },
            },
            {
                accessorKey: 'service.name',
                header: 'Servicio',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <span>{row.original.service?.name}</span>
                        <span className={`h-2 w-2 rounded-full ${SERVICE_STATUS_COLORS[row.original.service?.status || '']}`} />
                    </div>
                ),
            },
            {
                accessorKey: 'steps',
                header: 'Solución',
                cell: ({ row }) => {
                    const steps = row.original.steps as string | null;
                    const incidentId = row.original.id;

                    return (
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${steps ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <IncidentSolutionDrawer
                                incidentId={incidentId}
                                title={row.original.title}
                                steps={steps}
                                onStatusUpdated={(newStatus) => updateIncidentStatus(incidentId, newStatus as 'Abierto' | 'En Proceso' | 'Cerrado')}
                            />
                        </div>
                    );
                },
            },
            {
                accessorKey: 'resolved_at',
                header: 'Resuelto en',
                cell: ({ row }) => (
                    <div className="text-sm">
                        {row.getValue('resolved_at') ? new Date(row.getValue('resolved_at')).toLocaleDateString('es-ES') : 'Pendiente'}
                    </div>
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
                                <DropdownMenuItem
                                    onClick={() => {
                                        //const toastId = toast.loading('Eliminando producto...');
                                        destroy(route('incidents.destroy', row.original.id), {
                                            //onSuccess: () => toast.remove(toastId),
                                        });
                                    }}
                                >
                                    Marcar como resuelto
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [],
    );

    const { services } = usePage<{ services: Service[] }>().props;
    const { data, setData, post, errors } = useForm<IncidentFormData>({
        title: '',
        description: '',
        service_id: '',
        category: '',
    });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('incidents.store'), {
            preserveScroll: true,
            onError: () => {},
        });
    };

    // Estados para los filtros
    const [priority, setPriority] = React.useState(filters.priority || 'all');
    const [status, setStatus] = React.useState(filters.status || 'all');
    const [month, setMonth] = React.useState(filters.month || 'all');
    const [year, setYear] = React.useState(filters.year || 'all');

    const [appliedPriority, setAppliedPriority] = React.useState(filters.priority || 'all');
    const [appliedStatus, setAppliedStatus] = React.useState(filters.status || 'all');
    const [appliedMonth, setAppliedMonth] = React.useState(filters.month || 'all');
    const [appliedYear, setAppliedYear] = React.useState(filters.year || 'all');

    const applyFilters = () => {
        router.get('/incidents', {
            priority: priority !== 'all' ? priority : null,
            status: status !== 'all' ? status : null,
            month: month !== 'all' ? month : null,
            year: year !== 'all' ? year : null,
        });
        setAppliedPriority(priority);
        setAppliedStatus(status);
        setAppliedMonth(month);
        setAppliedYear(year);
    };

    const resetFilters = () => {
        setPriority('all');
        setStatus('all');
        setMonth('all');
        setYear('all');
        setAppliedPriority('all');
        setAppliedStatus('all');
        setAppliedMonth('all');
        setAppliedYear('all');
        router.get('/incidents');
    };

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

    const pieChartData = React.useMemo<ChartData[]>(() => {
        if (priority !== 'all') {
            return [
                {
                    name: priority,
                    value: incidents.length,
                    fill: PRIORITY_COLORS[priority],
                },
            ];
        }

        const priorities: ChartData[] = [
            { name: 'Alta', value: 0, fill: PRIORITY_COLORS['Alta'] },
            { name: 'Media', value: 0, fill: PRIORITY_COLORS['Media'] },
            { name: 'Baja', value: 0, fill: PRIORITY_COLORS['Baja'] },
        ];

        incidents.forEach((incident) => {
            const index = priorities.findIndex((p) => p.name === incident.priority);
            if (index >= 0) {
                priorities[index].value++;
            }
        });

        return priorities.filter((p) => p.value > 0);
    }, [incidents, priority]);

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

    const pieChartCenterText = (
        <>
            <tspan x="50%" dy="-12" className="fill-foreground text-3xl font-bold">
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
                <div className="flex items-center justify-between">
                    <IncidentFilters
                        priority={priority}
                        setPriority={setPriority}
                        status={status}
                        setStatus={setStatus}
                        month={month}
                        setMonth={setMonth}
                        year={year}
                        setYear={setYear}
                        years={years}
                        months={months}
                        applyFilters={applyFilters}
                        resetFilters={resetFilters}
                    />
                    <RegisterIncidentDialog data={data} setData={setData} post={post} errors={errors} services={services} submit={submit} />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[2fr_1fr]">
                    <IncidentBarChart incidents={incidents} month={appliedMonth} year={appliedYear} months={months} />
                    <IncidentPieChart incidents={incidents} priority={appliedPriority} PRIORITY_COLORS={PRIORITY_COLORS} />
                </div>
                <IncidentsTable table={table} columns={columns} />
            </div>
        </AppLayout>
    );
}
