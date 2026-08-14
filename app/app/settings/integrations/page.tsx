import { IntegrationsSettings } from '../components/IntegrationsSettings';

export default function IntegrationsPage() {
    return (
        <div className="flex-1 h-full overflow-y-auto bg-bg-main p-8 text-text-primary custom-scrollbar">
            <div className="max-w-[900px] mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight">Integrations</h1>
                </div>

                <IntegrationsSettings />

            </div>
        </div>
    );
}
