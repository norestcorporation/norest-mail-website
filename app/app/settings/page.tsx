import { AccountSettings } from './components/AccountSettings';

export default function SettingsPage() {
    return (
        <div className="flex-1 h-full overflow-y-auto bg-bg-main p-8 text-text-primary custom-scrollbar">
            <div className="max-w-[900px] mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                    <div className="flex gap-3">
                        <button className="cursor-pointer px-4 py-2 rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-[14px] font-semibold transition-colors">
                            Cancel
                        </button>
                        <button className="cursor-pointer px-4 py-2 rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-[14px] font-semibold transition-colors">
                            Save changes
                        </button>
                    </div>
                </div>

                <AccountSettings />

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-border-divider pb-12">
                    <button className="px-4 py-2 rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-[14px] font-semibold cursor-pointer transition-colors">
                        Cancel
                    </button>
                    <button className="px-4 py-2 rounded-full bg-text-primary text-bg-main hover:opacity-90 text-[14px] font-semibold transition-colors cursor-pointer">
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );
}
