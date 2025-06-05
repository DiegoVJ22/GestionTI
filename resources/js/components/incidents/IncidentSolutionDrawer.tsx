import { Button } from '@/components/ui/button';
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
import * as React from 'react';

type IncidentSolutionDrawerProps = {
    incidentId: number;
    title: string;
    steps?: string | null;
    onStatusUpdated?: (newStatus: string) => void;
};

export function IncidentSolutionDrawer({ incidentId, title, steps: initialSteps = null, onStatusUpdated }: IncidentSolutionDrawerProps) {
    const [steps, setSteps] = React.useState<string | null>(initialSteps);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        setSteps(initialSteps);
    }, [initialSteps]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(steps || '');
    };

    const handleGenerate = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.getAttribute('content') || '';
            console.log('CSRF token:', csrfToken);

            const response = await fetch(`/incidents/${incidentId}/solve-openai`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                try {
                    const errorJson = await response.json();
                    console.error('Error de backend:', errorJson);
                } catch (e) {
                    console.error('Respuesta inesperada:', e);
                }
                return;
            }

            const data = await response.json();
            // setSteps(data.recommendation || '');
            const newSteps = data.recommendation || '';
            setSteps(newSteps);

            // Notificamos al padre que el estado fue actualizado
            if (onStatusUpdated) {
                onStatusUpdated('En Proceso');
            }
        } catch (err) {
            console.error('Error al llamar a OpenAI:', err);
        } finally {
            setLoading(false);
        }
    };

    // Determina el texto del botón trigger basado en si hay steps
    const hasSteps = Boolean(steps);
    const triggerText = hasSteps ? 'Ver Solución' : 'Generar';

    // return (
    //     <Drawer>
    //         {/* Ya no está deshabilitado; así siempre podrás abrir el Drawer */}
    //         <DrawerTrigger asChild>
    //             <Button
    //                 variant="link"
    //                 className="h-auto max-w-[300px] truncate p-0 text-left text-sm font-normal"
    //             >
    //                 Ver
    //             </Button>
    //         </DrawerTrigger>

    //         <DrawerContent className="max-h-[80vh]">
    //             <div className="mx-auto w-full max-w-2xl">
    //                 <DrawerHeader>
    //                     <DrawerTitle className="flex items-center gap-2">
    //                         <span>Pasos de solución</span>
    //                         <span className="text-muted-foreground text-sm font-normal">
    //                             ({title})
    //                         </span>
    //                     </DrawerTitle>
    //                     <DrawerDescription>
    //                         Procedimiento detallado para resolver el incidente
    //                     </DrawerDescription>
    //                 </DrawerHeader>

    //                 <div className="p-4 pb-0">
    //                     <div className="bg-accent/50 rounded-lg p-4">
    //                         <pre className="font-sans whitespace-pre-wrap">
    //                             {/*
    //               Cuando steps sea null, mostrará este texto:
    //             */}
    //                             {steps
    //                                 ? steps.split('\n').map((step, index) => (
    //                                     <div key={index} className="mb-2 last:mb-0">
    //                                         {step}
    //                                     </div>
    //                                 ))
    //                                 : 'No se han registrado pasos de solución'}
    //                         </pre>
    //                     </div>
    //                 </div>

    //                 <DrawerFooter className="pt-4">
    //                     <div className="flex gap-2 flex-wrap">
    //                         {/* Copiar pasos sólo se habilita si steps ya existe */}
    //                         <Button
    //                             onClick={copyToClipboard}
    //                             variant="secondary"
    //                             disabled={!steps}
    //                             className="cursor-pointer bg-[#3A3128] hover:bg-[#FCDFC2] hover:text-black"
    //                         >
    //                             <svg
    //                                 xmlns="http://www.w3.org/2000/svg"
    //                                 className="mr-2 h-4 w-4"
    //                                 viewBox="0 0 24 24"
    //                             >
    //                                 <path
    //                                     fill="currentColor"
    //                                     d="M9 18q-.825 0-1.412-.587Q7 16.825 7 16V4q0-.825.588-1.413Q8.175 2 9 2h9q.825 0 1.413.587Q20 3.175 20 4v12q0 .825-.587 1.413Q18.825 18 18 18Zm0-2h9V4H9v12Zm-4 6q-.825 0-1.412-.587Q3 20.825 3 20V7q0-.425.288-.713Q3.575 6 4 6t.713.287Q5 6.575 5 7v13h10q.425 0 .713.288q.287.287.287.712t-.287.712Q15.425 22 15 22ZM9 4v12V4Z"
    //                                 />
    //                             </svg>
    //                             Copiar pasos
    //                         </Button>

    //                         {/* Generar / Generando... */}
    //                         <Button onClick={handleGenerate} variant="default" className="cursor-pointer" disabled={loading}>
    //                             {loading ? 'Generando...' : 'Generar'}
    //                         </Button>

    //                         {/* Cerrar el Drawer */}
    //                         <DrawerClose asChild>
    //                             <Button className="bg-red-700 text-white hover:bg-red-600 cursor-pointer">Cerrar</Button>
    //                         </DrawerClose>
    //                     </div>
    //                 </DrawerFooter>
    //             </div>
    //         </DrawerContent>
    //     </Drawer>
    // );

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button
                    variant="link"
                    className={`h-auto max-w-[300px] truncate p-0 text-left text-sm font-normal ${
                        hasSteps ? 'text-green-600 hover:text-green-700' : 'text-blue-600 hover:text-blue-700'
                    }`}
                >
                    {triggerText}
                </Button>
            </DrawerTrigger>

            <DrawerContent className="max-h-[80vh]">
                <div className="mx-auto w-full max-w-2xl">
                    <DrawerHeader>
                        <DrawerTitle className="flex items-center gap-2">
                            <span>Pasos de solución</span>
                            <span className="text-muted-foreground text-sm font-normal">({title})</span>
                            {hasSteps && (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                    Disponible
                                </span>
                            )}
                        </DrawerTitle>
                        <DrawerDescription>
                            {hasSteps ? 'Procedimiento detallado para resolver el incidente' : 'Genera una solución automática para este incidente'}
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="p-4 pb-0">
                        <div className="bg-accent/50 rounded-lg p-4">
                            {hasSteps ? (
                                <div className="space-y-2">
                                    {(steps ?? '').split('\n').map((step, index) => {
                                        const trimmedStep = step.trim();
                                        if (!trimmedStep) return null;

                                        return (
                                            <div key={index} className="flex items-start gap-2">
                                                <span className="bg-primary text-primary-foreground mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium">
                                                    {index + 1}
                                                </span>
                                                <span className="text-sm leading-relaxed">{trimmedStep}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-muted-foreground py-8 text-center">
                                    <div className="mb-4">
                                        <svg
                                            className="text-muted-foreground/50 mx-auto h-12 w-12"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium">No hay solución disponible</p>
                                    <p className="mt-1 text-xs">Haz clic en "Generar" para crear una solución automática</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <DrawerFooter className="pt-4">
                        <div className="flex flex-wrap gap-2">
                            {/* Botón Copiar - solo visible si hay steps */}
                            {hasSteps && (
                                <Button
                                    onClick={copyToClipboard}
                                    variant="secondary"
                                    className="cursor-pointer bg-[#3A3128] hover:bg-[#FCDFC2] hover:text-black"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M9 18q-.825 0-1.412-.587Q7 16.825 7 16V4q0-.825.588-1.413Q8.175 2 9 2h9q.825 0 1.413.587Q20 3.175 20 4v12q0 .825-.587 1.413Q18.825 18 18 18Zm0-2h9V4H9v12Zm-4 6q-.825 0-1.412-.587Q3 20.825 3 20V7q0-.425.288-.713Q3.575 6 4 6t.713.287Q5 6.575 5 7v13h10q.425 0 .713.288q.287.287.287.712t-.287.712Q15.425 22 15 22ZM9 4v12V4Z"
                                        />
                                    </svg>
                                    Copiar pasos
                                </Button>
                            )}

                            {/* Botón Generar/Regenerar */}
                            <Button onClick={handleGenerate} variant="default" className="cursor-pointer" disabled={loading}>
                                {loading ? 'Generando...' : hasSteps ? 'Regenerar' : 'Generar'}
                            </Button>

                            {/* Botón Cerrar */}
                            <DrawerClose asChild>
                                <Button className="cursor-pointer bg-red-700 text-white hover:bg-red-600">Cerrar</Button>
                            </DrawerClose>
                        </div>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
