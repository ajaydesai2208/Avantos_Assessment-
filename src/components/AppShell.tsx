import type { ReactNode } from "react";

export function AppShell({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle?: string;
    children: ReactNode;
}) {
    return (
        <div className="page">
            <header className="header">
                <div>
                    <h1 className="h1">{title}</h1>
                    {subtitle && <div className="subtle">{subtitle}</div>}
                </div>
            </header>
            <main className = "main">{children}</main>
            <footer className="footer subtle">
                Built fot the Journey Builder React Coding Challenge
            </footer>
        </div>
    );
}