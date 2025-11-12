export interface AppMenuItem {
    label: string;
    icon?: string;
    items?: AppMenuItem[];
    route?: { name: string }; // Vue Router Named Route
    url?: string; // External URL
    target?: string; // For external link target (_blank, etc.)
}
