/** Site navigation, shared by the header and the footer. */
export interface NavLink {
    label: string;
    href: string;
}

export const NAV_LINKS: NavLink[] = [
    { label: 'Home', href: '/' },
    { label: 'Gallery', href: '/gallery' },
];
