import { SettingsSection } from "./SettingsSection";

export function PublicProfileSection() {
  return (
    <SettingsSection title="Primary Mailbox" description="This is your primary email address for sending and receiving.">
      <div className="flex flex-col gap-4">
        <div className="flex border border-border-divider rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-text-secondary transition-shadow bg-bg-main">
          <input
            type="email"
            defaultValue="hello@theripun.com"
            className="w-full bg-transparent px-3 py-2 text-[14px] font-medium text-text-primary outline-none placeholder:text-text-tertiary"
          />
        </div>
      </div>
    </SettingsSection>
  );
}
