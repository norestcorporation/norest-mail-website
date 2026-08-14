import { AdvancedAdminSettings } from '../components/AdvancedAdminSettings';

export default function AdvancedSettingsPage() {
    return (
        <div className="flex-1 h-full overflow-y-auto bg-bg-main p-8 text-text-primary custom-scrollbar">
            <div className="max-w-[1000px] mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight">Advanced Settings</h1>
                </div>

                <AdvancedAdminSettings />

            </div>
        </div>
    );
}
