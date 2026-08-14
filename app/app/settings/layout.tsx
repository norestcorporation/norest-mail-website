export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dark flex-1 w-full h-full flex bg-bg-main text-text-primary overflow-hidden">
            <div className="flex-1 w-full h-full animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
                {children}
            </div>
        </div>
    );
}
