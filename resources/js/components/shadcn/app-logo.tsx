import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            {/* Contenedor del ícono (azul tecnológico) */}
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-[#393028] text-white">
                <AppLogoIcon className="size-5 fill-current" />
            </div>

            {/* Texto con subtítulo */}
            <div className="grid flex-1 text-left">
                <span className="truncate text-sm leading-none font-semibold">IncidentIQ</span>
                <span className="-mt-0.5 text-xs text-gray-500 dark:text-gray-400">AI-Powered Solutions</span>
            </div>
        </div>
    );
}
