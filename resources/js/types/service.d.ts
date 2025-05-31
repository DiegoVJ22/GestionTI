// service.interface.ts

export interface Service {
    id: number;
    name: string;
    status: 'Operativo' | 'Inestable' | 'Crítico';
    last_checked_at: Date | null;
    created_at: Date;
    updated_at: Date;
}
