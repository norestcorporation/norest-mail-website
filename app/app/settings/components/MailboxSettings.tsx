"use client";

import React, { useState } from 'react';
import { SettingsSection } from './SettingsSection';
import { Database, HardDrive, Plus, Edit2, Trash2, Shield, Users, Archive, RefreshCw, Clock, CheckCircle, Info, Settings, Zap, ChevronRight, ChevronDown } from 'lucide-react';

export function MailboxSettings() {
  const [retentionOpen, setRetentionOpen] = useState(false);
  const [retentionValue, setRetentionValue] = useState('Forever (Never delete)');
  const retentionOptions = ['Forever (Never delete)', '30 days', '90 days', '1 year', '3 years'];

  return (
    <div className="flex flex-col gap-6 divide-y divide-border-divider">

      {/* --- Storage & Capacity --- */}
      <div className="flex flex-col gap-6 pt-4 w-full">
        <h2 className="text-lg font-semibold text-text-primary">Storage & Capacity</h2>

        <div className="flex flex-col rounded-xl bg-transparent text-[#a1a1aa] w-full p-5 font-sans shadow-lg">

          {/* Info Alert */}
          <div className="flex items-center justify-between bg-blue-800 rounded-lg p-3.5 mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-[18px] h-[18px] rounded-full bg-white flex items-center justify-center shrink-0">
                <span className="text-blue-600 font-bold text-[11px] font-serif italic">i</span>
              </div>
              <span className="text-[13px] text-white leading-tight font-medium">
                Your mailbox is currently using 15% of its total storage capacity.<br />
                Consider archiving old emails or deleting large attachments to free up space.
              </span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <button className="text-[13px] font-medium text-white/80 hover:text-white transition-colors cursor-pointer">Don't Show Again</button>
              <button className="text-[13px] font-medium px-4 py-1 rounded-full border border-white hover:bg-white/10 text-white transition-colors cursor-pointer">Okay</button>
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[14px]">Storage used:</span>
              <span className="text-[14px] font-semibold text-white">15% (1.5 GB of 10 GB)</span>
            </div>
          </div>

          {/* Segmented Progress Bar */}
          <div className="relative mb-10">
            <div className="flex justify-between h-[22px] gap-[2px]">
              {Array.from({ length: 41 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-[1px] ${i < 18 ? 'bg-blue-700' : 'bg-[#27272a]'}`}
                />
              ))}
            </div>
            {/* Level Markers */}
            <div className="absolute top-full left-0 right-0 flex text-[11px] text-[#71717a] pt-3">
              <div className="w-1/5 text-center border-l border-[#27272a] h-6 relative">
                <span className="absolute left-1/2 -translate-x-1/2 -mt-1">lvl 1</span>
              </div>
              <div className="w-1/5 text-center border-l border-[#27272a] h-6 relative">
                <span className="absolute left-1/2 -translate-x-1/2 -mt-1">lvl 2</span>
              </div>
              <div className="w-1/5 text-center border-l border-[#27272a] h-6 relative">
                <span className="absolute left-1/2 -translate-x-1/2 -mt-1">lvl 3</span>
              </div>
              <div className="w-1/5 text-center border-l border-[#27272a] h-6 relative">
                <span className="absolute left-1/2 -translate-x-1/2 -mt-1">lvl 4</span>
              </div>
              <div className="w-1/5 text-center border-l border-r border-[#27272a] h-6 relative">
                <span className="absolute left-1/2 -translate-x-1/2 -mt-1">lvl 5</span>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-[#000] rounded-xl p-4 flex flex-col justify-between h-[90px]">
              <div className="flex items-center gap-2 text-[#71717a] mb-2">
                <Archive size={14} className="text-[#a1a1aa]" />
                <span className="text-[11px] font-bold tracking-wider uppercase">Emails Stored</span>
              </div>
              <div className="text-[17px] font-semibold text-white">12,450</div>
            </div>

            <div className="bg-[#000] rounded-xl p-4 flex flex-col justify-between h-[90px]">
              <div className="flex items-center gap-2 text-[#71717a] mb-2">
                <HardDrive size={14} className="text-[#a1a1aa]" />
                <span className="text-[11px] font-bold tracking-wider uppercase">Attachments</span>
              </div>
              <div className="text-[17px] font-semibold text-white">1.2 GB</div>
            </div>

            <div className="bg-[#000] rounded-xl p-4 flex flex-col justify-between h-[90px] group cursor-pointer hover:bg-[#fff]/2 transition-colors relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[#71717a]">
                  <Trash2 size={14} className="text-[#a1a1aa]" />
                  <span className="text-[11px] font-bold tracking-wider uppercase">Free Up Space</span>
                </div>
                <ChevronRight size={16} className="text-[#71717a] group-hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-[#71717a] mb-0.5">Quick Action</span>
                <span className="text-[14px] font-medium text-white">Review Large Files</span>
              </div>
            </div>
          </div>

          {/* Mailbox Activity Chart Area */}
          <div className="bg-[#000] rounded-xl p-5 pb-7 flex flex-col mt-2">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[15px] font-medium text-white">Mailbox Activity</span>
              <div className="flex items-center gap-4 text-[13px] font-medium text-[#71717a]">
                <button className="hover:text-white transition-colors cursor-pointer">7d</button>
                <button className="hover:text-white transition-colors cursor-pointer">1m</button>
                <button className="hover:text-white transition-colors cursor-pointer">6m</button>
                <button className="hover:text-white transition-colors cursor-pointer">1y</button>
                <button className="bg-[#3f3f46] text-white px-2.5 py-1 rounded-md transition-colors cursor-pointer">All</button>
              </div>
            </div>

            <div className="w-full overflow-x-auto scrollbar-hide pb-2">
              <div className="flex gap-[3px] min-w-max">
                {Array.from({ length: 52 }).map((_, col) => (
                  <div key={col} className="flex flex-col gap-[3px]">
                    {Array.from({ length: 7 }).map((_, row) => {
                      const val = (col * 29 + row * 17) % 100;
                      let bg = 'bg-[#27272a]';
                      if (val > 85) bg = 'bg-blue-400';
                      else if (val > 65) bg = 'bg-blue-600';
                      else if (val > 45) bg = 'bg-blue-800';
                      return <div key={row} className={`w-[11px] h-[11px] rounded-[2px] ${bg}`} />;
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#71717a] mt-3">
              <div className="flex gap-8 pl-1">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span>Less</span>
                <div className="w-[11px] h-[11px] rounded-[2px] bg-[#27272a]"></div>
                <div className="w-[11px] h-[11px] rounded-[2px] bg-blue-800"></div>
                <div className="w-[11px] h-[11px] rounded-[2px] bg-blue-600"></div>
                <div className="w-[11px] h-[11px] rounded-[2px] bg-blue-400"></div>
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Mailbox Management --- */}
      <div className="flex flex-col gap-6 pt-8">
        <h2 className="text-lg font-semibold text-text-primary">Mailbox Management</h2>

        <SettingsSection title="Create Mailbox" description="Add a new custom mailbox to your account.">
          <button className="cursor-pointer px-4 py-2 text-[14px] font-medium rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-text-primary flex items-center gap-2 transition-colors">
            <Plus size={16} />
            Create new mailbox
          </button>
        </SettingsSection>

        <SettingsSection title="Rename Mailbox" description="Change the display name of your current mailbox.">
          <div className="flex items-center gap-3">
            <input type="text" defaultValue="Ripun's Primary" className="flex-1 bg-bg-surface px-3 py-2 text-[14px] font-medium text-text-primary rounded-lg outline-none font-semibold border border-border-divider focus:border-text-primary transition-colors" />
            <button className="px-4 py-2 text-[14px] font-medium rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-text-primary transition-colors flex items-center gap-2 cursor-pointer">
              <Edit2 size={16} />
              Rename
            </button>
          </div>
        </SettingsSection>

        <SettingsSection title="Super Mailbox" description="This is a superadmin mailbox. It has elevated privileges and cannot be deleted.">
          <div className="flex items-center justify-between p-4 rounded-lg bg-bg-surface border border-border-divider border-blue-500/30">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-white" />
              <div>
                <p className="text-[14px] font-semibold text-text-primary">Super Mailbox</p>
                <p className="text-[13px] text-text-tertiary">Administrative access granted</p>
              </div>
            </div>
            <span className="text-[12px] font-semibold text-white bg-blue-700 px-2.5 py-1 rounded-md">Superadmin</span>
          </div>
        </SettingsSection>
      </div>

      {/* --- Access & Permissions --- */}
      <div className="flex flex-col gap-6 pt-8">
        <h2 className="text-lg font-semibold text-text-primary">Access & Permissions</h2>

        <SettingsSection title="Mailbox Permissions" description="Manage who can access and send from this mailbox.">
          <button className="cursor-pointer px-4 py-2 text-[14px] font-medium rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-text-primary flex items-center gap-2 transition-colors">
            <Shield size={16} />
            Manage permissions
          </button>
        </SettingsSection>

        <SettingsSection title="Shared Mailboxes" description="View and manage mailboxes shared with you.">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-bg-surface">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-text-secondary" />
                <span className="text-[14px] font-semibold text-text-primary">team@theripun.com</span>
              </div>
              <span className="text-[12px] font-medium text-text-secondary bg-border-divider/50 px-2 py-1 rounded">Read & Write</span>
            </div>
          </div>
        </SettingsSection>
      </div>

      {/* --- Data & Lifecycle --- */}
      <div className="flex flex-col gap-6 pt-8 pb-6">
        <h2 className="text-lg font-semibold text-text-primary">Data & Lifecycle</h2>

        <SettingsSection title="Mailbox Retention" description="Configure how long emails are kept before deletion.">
          <div className="relative">
            <button
              onClick={() => setRetentionOpen(!retentionOpen)}
              className="flex items-center justify-between gap-3 bg-[#111] px-4 py-2 text-[15px] font-semibold text-white rounded-xl outline-none cursor-pointer min-w-[260px] hover:border-[#3f3f46] transition-colors"
            >
              <span>{retentionValue}</span>
              <ChevronDown size={18} className={`transition-transform text-[#a1a1aa] ${retentionOpen ? 'rotate-180' : ''}`} />
            </button>

            {retentionOpen && (
              <div className="absolute top-full left-0 mt-1 min-w-[260px] bg-[#111] border border-[#27272a] rounded-lg shadow-xl overflow-hidden z-10 flex flex-col py-1">
                {retentionOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setRetentionValue(option);
                      setRetentionOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-[15px] transition-colors ${retentionValue === option
                      ? 'bg-[#93c5fd] text-[#111] font-medium'
                      : 'text-white hover:bg-[#27272a]'
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </SettingsSection>

        <SettingsSection title="Archive & Restore" description="Archive old mail or restore from a backup.">
          <div className="flex gap-3">
            <button className="cursor-pointer px-4 py-2 text-[14px] font-medium rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-text-primary flex items-center gap-2 transition-colors">
              <Archive size={16} />
              Archive mailbox
            </button>
            <button className="cursor-pointer px-4 py-2 text-[14px] font-medium rounded-full border-2 border-border-divider hover:bg-bg-surface-hover text-text-primary flex items-center gap-2 transition-colors">
              <RefreshCw size={16} />
              Restore data
            </button>
          </div>
        </SettingsSection>

        <SettingsSection title="Delete Mailbox" description="Deleting a mailbox is irreversible. All emails and settings will be lost.">
          <div className="flex flex-col gap-3">
            <div>
              <button disabled className="opacity-50 cursor-not-allowed px-4 py-2 text-[14px] font-medium rounded-full border-2 border-red-500/20 bg-red-500/10 text-red-500 flex items-center gap-2 transition-colors">
                <Trash2 size={16} />
                Delete mailbox
              </button>
              <p className="mt-2 text-[12px] text-text-tertiary font-medium">Action disabled: Superadmin mailboxes cannot be deleted.</p>
            </div>
          </div>
        </SettingsSection>
      </div>

    </div>
  );
}
