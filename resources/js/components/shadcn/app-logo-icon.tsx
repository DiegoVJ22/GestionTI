import { BrainCircuit } from 'lucide-react';
import { SVGAttributes } from 'react';

// Opción 1: Pasar todas las props al ícono de Lucide
export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return <BrainCircuit {...props} />;
}
