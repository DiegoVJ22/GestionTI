// incident.interface.ts

export interface Incident {
    id: number;
    title: string;
    priority: 'Alta' | 'Media' | 'Baja';
    status: 'Abierto' | 'En Proceso' | 'Cerrado';
    service: {
        name: string;
        status: string;
    };
    resolved_at: string | null;
    created_at: string;
    solutions_count?: number;
    steps?: string; // Nuevo campo
}
