import { SecuritySettings } from '../components/SecuritySettings';

export default function SecurityPage() {
    return (
        <div className="flex-1 h-full overflow-y-auto bg-bg-main p-8 text-text-primary custom-scrollbar">
            <div className="max-w-[900px] mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight">Security</h1>
                </div>

                <SecuritySettings />

            </div>
        </div>
    );
}
