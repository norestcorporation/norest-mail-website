import React from 'react';
import { SettingsSection } from './SettingsSection';
import { Shield, Key, Smartphone, Laptop, Activity, Download, Trash2, Mail, Lock, User as UserIcon } from 'lucide-react';
import { FaGithub, FaApple } from 'react-icons/fa';

export function AccountSettings() {
  return (
    <div className="flex flex-col gap-6 divide-y divide-border-divider">

      {/* --- Profile Details --- */}
      <div className="flex flex-col gap-6 pt-4">
        <h2 className="text-lg font-semibold text-text-primary">Profile Details</h2>

        <SettingsSection title="Profile Picture" description="Your avatar will be shown publicly.">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-none overflow-hidden border border-border-divider shrink-0">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-[14px] cursor-pointer font-semibold rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-text-primary transition-colors">
                Change avatar
              </button>
              <button className="px-4 py-2 text-[14px] cursor-pointer font-semibold rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-text-primary transition-colors">
                Remove
              </button>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Display Name" description="Your full name or display name.">
          <input type="text" defaultValue="Ripun" className="w-full bg-bg-surface px-3 py-2 text-[14px] font-medium text-text-primary rounded-lg outline-none font-semibold" />
        </SettingsSection>

        <SettingsSection title="Username" description="Your unique username on the platform.">
          <div className="flex rounded-lg overflow-hidden transition-shadow bg-bg-surface">
            <span className="px-3 py-2 text-[14px] font-medium text-text-tertiary border-r border-border-divider select-none flex items-center bg-bg-surface-hover">
              @
            </span>
            <input type="text" defaultValue="ripun" className="w-full bg-bg-surface px-3 py-2 text-[14px] font-medium text-text-primary rounded-lg outline-none font-semibold" />
          </div>
        </SettingsSection>

        <SettingsSection title="Primary Email Address" description="Used for login and primary communications.">
          <div className="flex items-center gap-3">
            <input type="email" defaultValue="hello@theripun.com" className="flex-1 bg-bg-surface px-3 py-2 text-[14px] font-medium text-text-primary rounded-lg outline-none font-semibold" />
            <span className="px-2 py-2 text-xs font-semibold bg-blue-700 text-white rounded-none">Verified</span>
          </div>
        </SettingsSection>

        <SettingsSection title="Recovery Email" description="Used if you lose access to your primary email.">
          <input type="email" placeholder="backup@example.com" className="w-full bg-bg-surface px-3 py-2 text-[14px] font-medium text-text-primary rounded-lg outline-none font-semibold" />
        </SettingsSection>
      </div>

      {/* --- Security & Authentication --- */}
      <div className="flex flex-col gap-6 pt-8">
        <h2 className="text-lg font-semibold text-text-primary">Security & Authentication</h2>

        <SettingsSection title="Password" description="Change your account password.">
          <button className="cursor-pointer px-4 py-2 text-[14px] font-medium rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-text-primary flex items-center gap-2 transition-colors">
            <Lock size={16} />
            Update password
          </button>
        </SettingsSection>

        <SettingsSection title="Two-Factor Authentication" description="Add an extra layer of security to your account.">
          <div className="flex items-center justify-between p-4 rounded-lg bg-bg-surface">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-text-secondary" />
              <div>
                <p className="text-[14px] font-semibold text-text-primary">Authenticator App</p>
                <p className="text-[13px] text-text-tertiary">Not configured</p>
              </div>
            </div>
            <button className="px-3 py-1.5 text-[13px] font-medium rounded-full bg-text-primary text-bg-main hover:opacity-90 transition-colors">
              Enable
            </button>
          </div>
        </SettingsSection>

        <SettingsSection title="Passkeys" description="Sign in faster and safer using your device.">
          <button className="cursor-pointer px-4 py-2 text-[14px] font-medium rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-text-primary flex items-center gap-2 transition-colors">
            <Key size={16} />
            Register passkey
          </button>
        </SettingsSection>

        <SettingsSection title="Security Keys" description="Hardware security keys (YubiKey, etc).">
          <p className="text-[14px] text-text-secondary mb-3">No security keys registered.</p>
          <button className="cursor-pointer px-4 py-2 text-[14px] font-medium rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-text-primary transition-colors">
            Add security key
          </button>
        </SettingsSection>
      </div>

      {/* --- Connections & Sessions --- */}
      <div className="flex flex-col gap-6 pt-8">
        <h2 className="text-lg font-semibold text-text-primary">Connections & Sessions</h2>

        <SettingsSection title="Connected Accounts" description="Sign in using social accounts.">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-bg-surface">
              <div className="flex items-center gap-3">
                <FaGithub size={20} />
                <span className="text-[14px] font-semibold text-text-primary">GitHub</span>
              </div>
              <button className="text-[13px] font-medium text-text-secondary hover:text-text-primary">Connect</button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-bg-surface">
              <div className="flex items-center gap-3">
                <FaApple size={20} />
                <span className="text-[14px] font-semibold text-text-primary">Apple</span>
              </div>
              <button className="text-[13px] font-medium text-text-secondary hover:text-text-primary">Connect</button>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Login Sessions" description="Manage your active browser sessions.">
          <div className="flex items-center justify-between p-4 rounded-lg bg-bg-surface">
            <div className="flex items-center gap-3">
              <Laptop size={20} className="text-text-secondary" />
              <div>
                <p className="text-[14px] font-semibold text-text-primary">Mac OS • Safari</p>
                <p className="text-[13px] text-text-tertiary">Active now • New York, USA</p>
              </div>
            </div>
            <span className="text-[12px] font-medium text-white">Current</span>
          </div>
        </SettingsSection>

        <SettingsSection title="Devices" description="Mobile and desktop apps connected to your account.">
          <div className="flex items-center justify-between p-4 rounded-lg bg-bg-surface">
            <div className="flex items-center gap-3">
              <Smartphone size={20} className="text-text-secondary" />
              <div>
                <p className="text-[14px] font-semibold text-text-primary">iPhone 14 Pro</p>
                <p className="text-[13px] text-text-tertiary">Last active 2 hours ago</p>
              </div>
            </div>
            <button className="text-[13px] font-medium text-red-500 hover:text-red-400">Revoke</button>
          </div>
        </SettingsSection>

        <SettingsSection title="Account Activity" description="View recent login events and security alerts.">
          <button className="cursor-pointer px-4 py-2 text-[14px] font-medium rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-text-primary flex items-center gap-2 transition-colors">
            <Activity size={16} />
            View activity log
          </button>
        </SettingsSection>
      </div>

      {/* --- Data & Privacy --- */}
      <div className="flex flex-col gap-6 pt-8 pb-6">
        <h2 className="text-lg font-semibold text-text-primary">Data & Privacy</h2>

        <SettingsSection title="Export Data" description="Download a copy of your personal data.">
          <button className="cursor-pointer px-4 py-2 text-[14px] font-medium rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-text-primary flex items-center gap-2 transition-colors">
            <Download size={16} />
            Request data export
          </button>
        </SettingsSection>

        <SettingsSection title="Delete Account" description="Permanently remove your account and data.">
          <div className="flex flex-col gap-3">
            <p className="text-[13px] text-text-tertiary">Once you delete your account, there is no going back. Please be certain.</p>
            <div>
              <button className="cursor-pointer px-4 py-2 text-[14px] font-medium rounded-full border-2 border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 flex items-center gap-2 transition-colors">
                <Trash2 size={16} />
                Delete my account
              </button>
            </div>
          </div>
        </SettingsSection>
      </div>

    </div>
  );
}
