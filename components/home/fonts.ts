import { Archivo, JetBrains_Mono } from 'next/font/google';

// Scoped to the home hero (applied via .variable on its wrapper) so other routes don't load these.
export const archivo = Archivo({
    variable: '--font-archivo',
    subsets: ['latin'],
    axes: ['wdth'],
    display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
    variable: '--font-jetbrains-mono',
    subsets: ['latin'],
    weight: ['400', '600'],
    display: 'swap',
});
