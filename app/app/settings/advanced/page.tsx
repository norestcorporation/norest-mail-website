import { AdvancedSettings } from '../components/AdvancedSettings';

export default function AdvancedPage() {
    return (
        <div className="flex-1 h-full overflow-y-auto bg-bg-main p-8 text-text-primary custom-scrollbar">
            <div className="max-w-[900px] mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight">Advanced</h1>
                </div>

                <AdvancedSettings />

            </div>
        </div>
    );
}
