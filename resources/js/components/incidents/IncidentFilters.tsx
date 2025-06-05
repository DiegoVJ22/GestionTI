import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type IncidentFiltersProps = {
    priority: string;
    setPriority: (value: string) => void;
    status: string;
    setStatus: (value: string) => void;
    month: string;
    setMonth: (value: string) => void;
    year: string;
    setYear: (value: string) => void;
    years: number[];
    months: { value: string; label: string }[];
    applyFilters: () => void;
    resetFilters: () => void;
};

export function IncidentFilters({
    priority,
    setPriority,
    status,
    setStatus,
    month,
    setMonth,
    year,
    setYear,
    years,
    months,
    applyFilters,
    resetFilters,
}: IncidentFiltersProps) {
    return (
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
                    <SelectItem value="En proceso">En proceso</SelectItem>
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
        </div>
    );
}
