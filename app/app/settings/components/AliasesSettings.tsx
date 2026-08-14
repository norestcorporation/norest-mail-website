import React from 'react';
import { SettingsSection } from './SettingsSection';
import { Plus, CheckCircle, Ban, Forward, Send, Clock, AlertCircle, Activity } from 'lucide-react';

export function AliasesSettings() {
  return (
    <div className="flex flex-col gap-6 divide-y divide-border-divider">

      {/* --- Management --- */}
      <div className="flex flex-col gap-6 pt-4">
        <h2 className="text-lg font-semibold text-text-primary">Alias Management</h2>

        <SettingsSection title="Create Alias" description="Create a new email alias to protect your main address.">
          <button className="cursor-pointer px-4 py-2 text-[14px] font-medium rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-text-primary flex items-center gap-2 transition-colors">
            <Plus size={16} />
            Create new alias
          </button>
        </SettingsSection>

        <SettingsSection title="Catch-all Address" description="Forward all emails sent to any non-existent address on your domain.">
          <div className="flex items-center gap-3">
            <input type="text" placeholder="e.g. catchall@yourdomain.com" className="flex-1 bg-bg-surface px-3 py-2 text-[14px] font-medium text-text-primary rounded-lg outline-none border border-border-divider transition-colors min-w-[260px] focus:ring-0" />
            <button className="px-4 py-2 text-[14px] font-medium rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-text-primary transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap">
              <CheckCircle size={16} />
              Enable Catch-all
            </button>
          </div>
        </SettingsSection>

        {/* Alias Table */}
        <div className="pt-2">
          <h3 className="text-[15px] font-semibold text-text-primary mb-4">Your Aliases</h3>
          <div className="w-full overflow-hidden rounded-xl border border-border-divider bg-black">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[#000] border-b border-border-divider text-text-secondary">
                <tr>
                  <th className="px-4 py-3 font-medium">Alias</th>
                  <th className="px-4 py-3 font-medium">Forwards To</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-divider text-text-primary">
                <tr className="hover:bg-bg-surface-hover transition-colors">
                  <td className="px-4 py-3 font-medium">shopping@theripun.com</td>
                  <td className="px-4 py-3 text-text-secondary">ripun@theripun.com</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-md text-[12px] font-semibold bg-green-500/10 text-green-500">Active</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-text-tertiary hover:text-white transition-colors text-[13px] font-medium cursor-pointer">Edit</button>
                  </td>
                </tr>
                <tr className="hover:bg-bg-surface-hover transition-colors">
                  <td className="px-4 py-3 font-medium">newsletter@theripun.com</td>
                  <td className="px-4 py-3 text-text-secondary">ripun@theripun.com</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-md text-[12px] font-semibold bg-green-500/10 text-green-500">Active</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-text-tertiary hover:text-white transition-colors text-[13px] font-medium cursor-pointer">Edit</button>
                  </td>
                </tr>
                <tr className="hover:bg-bg-surface-hover transition-colors">
                  <td className="px-4 py-3 font-medium">temp@theripun.com</td>
                  <td className="px-4 py-3 text-text-secondary">ripun@theripun.com</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-md text-[12px] font-semibold bg-red-500/10 text-red-500">Disabled</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-text-tertiary hover:text-white transition-colors text-[13px] font-medium cursor-pointer">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Configuration --- */}
      <div className="flex flex-col gap-6 pt-8">
        <h2 className="text-lg font-semibold text-text-primary">Configuration</h2>

        <SettingsSection title="Disable Alias" description="Temporarily block emails sent to specific aliases.">
          <button className="cursor-pointer px-4 py-2 text-[14px] font-medium rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-text-primary flex items-center gap-2 transition-colors">
            <Ban size={16} />
            Manage disabled aliases
          </button>
        </SettingsSection>

        <SettingsSection title="Forward Alias" description="Set up forwarding rules for your aliases to external addresses.">
          <button className="cursor-pointer px-4 py-2 text-[14px] font-medium rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-text-primary flex items-center gap-2 transition-colors">
            <Forward size={16} />
            Configure forwarding
          </button>
        </SettingsSection>

        <SettingsSection title="Send From Alias" description="Allow sending emails using your alias as the sender address.">
          <button className="cursor-pointer px-4 py-2 text-[14px] font-medium rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-text-primary flex items-center gap-2 transition-colors">
            <Send size={16} />
            Setup sending identities
          </button>
        </SettingsSection>
      </div>

      {/* --- Advanced --- */}
      <div className="flex flex-col gap-6 pt-8">
        <h2 className="text-lg font-semibold text-text-primary">Advanced Features</h2>

        <SettingsSection title="Temporary Alias" description="Create aliases that automatically expire after a set time.">
          <button className="cursor-pointer px-4 py-2 text-[14px] font-medium rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-text-primary flex items-center gap-2 transition-colors">
            <Clock size={16} />
            Generate temp alias
          </button>
        </SettingsSection>

        <SettingsSection title="Alias Limits" description="View and manage the number of aliases you can create.">
          <div className="flex items-center justify-between p-4 rounded-lg bg-black border border-border-divider">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-white" />
              <div>
                <p className="text-[14px] font-semibold text-text-primary">Usage: 12 / 50 Aliases</p>
                <p className="text-[13px] text-text-tertiary">Upgrade your plan to unlock more.</p>
              </div>
            </div>
            <div className="w-24 h-2 bg-[#27272a] rounded-none overflow-hidden shrink-0">
              <div className="h-full bg-white w-[24%] rounded-none"></div>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Alias Activity" description="Monitor receiving and forwarding activity across your aliases.">
          <button className="cursor-pointer px-4 py-2 text-[14px] font-medium rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-text-primary flex items-center gap-2 transition-colors">
            <Activity size={16} />
            View activity log
          </button>
        </SettingsSection>
      </div>

    </div>
  );
}
