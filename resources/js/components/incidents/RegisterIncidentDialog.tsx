import InputError from '@/components/shadcn/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label as ShadcnLabel } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { IncidentFormData } from '@/pages/incidents'; // Import IncidentFormData
import { Service } from '@/types/service';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type RegisterIncidentDialogProps = {
    data: IncidentFormData;
    setData: (key: keyof IncidentFormData, value: IncidentFormData[keyof IncidentFormData]) => void;
    post: ReturnType<typeof useForm<IncidentFormData>>['post'];
    errors: ReturnType<typeof useForm<IncidentFormData>>['errors'];
    services: Service[];
    submit: FormEventHandler;
};

export function RegisterIncidentDialog({ data, setData, post, errors, services, submit }: RegisterIncidentDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Registrar</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={submit}>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <ShadcnLabel htmlFor="title">Titulo</ShadcnLabel>
                            <Input
                                id="title"
                                className="mt-1 block w-full"
                                value={data.title as string}
                                onChange={(e) => setData('title', e.target.value)}
                                autoComplete="title"
                                placeholder=""
                            />
                            <InputError message={errors.title} />
                        </div>
                        <div className="grid gap-3">
                            <ShadcnLabel htmlFor="description">Descripción</ShadcnLabel>
                            <Textarea
                                id="description"
                                className="mt-1 block w-full"
                                value={data.description as string}
                                onChange={(e) => setData('description', e.target.value)}
                                autoComplete="descripcion"
                                placeholder=""
                            />
                            <InputError message={errors.description} />
                        </div>
                        <div className="grid gap-3">
                            <ShadcnLabel htmlFor="service">Servicio</ShadcnLabel>
                            <Select value={data.service_id as string} onValueChange={(value) => setData('service_id', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecciona un servicio" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Servicios</SelectLabel>
                                        {services.map((service) => (
                                            <SelectItem key={service.id} value={service.id.toString()}>
                                                {service.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.service_id} />
                        </div>
                        <div className="grid gap-3">
                            <ShadcnLabel htmlFor="category">Categoría</ShadcnLabel>
                            <Select value={data.category as string} onValueChange={(value) => setData('category', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Categorías</SelectLabel>
                                        <SelectItem value="Red">Red</SelectItem>
                                        <SelectItem value="Servidor">Servidor</SelectItem>
                                        <SelectItem value="Aplicación">Aplicación</SelectItem>
                                        <SelectItem value="Seguridad">Seguridad</SelectItem>
                                        <SelectItem value="Base de Datos">Base de Datos</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category} />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit">Registrar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
