import React from 'react';

export function SettingsSection({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-8 py-6">
      <div className="w-full md:w-[280px] shrink-0">
        <h3 className="text-[14.5px] font-semibold text-text-primary mb-1">{title}</h3>
        <p className="text-[13.5px] font-medium text-white/50">{description}</p>
      </div>
      <div className="flex-1 max-w-2xl">
        {children}
      </div>
    </div>
  );
}
