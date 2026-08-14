import { SettingsSection } from "./SettingsSection";
import { Trash2 } from "lucide-react";

export function CompanyLogoSection() {
  return (
    <SettingsSection title="Company logo" description="Update your company logo.">
      <div className="flex items-center gap-5">
        {/* Placeholder for the gradient logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-500 to-red-500 shrink-0 shadow-inner"></div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-[10px] text-[14px] font-medium rounded-lg border border-border-divider hover:bg-bg-surface-hover text-text-primary transition-colors flex items-center justify-center">
            Replace logo
          </button>
          <button className="p-[10px] rounded-lg border border-border-divider hover:bg-bg-surface-hover text-text-secondary transition-colors flex items-center justify-center">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </SettingsSection>
  );
}
