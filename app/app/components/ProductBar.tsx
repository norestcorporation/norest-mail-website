"use client";

import Link from "next/link";
import { Calendar, Mail, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function ProductBar() {
  const pathname = usePathname();
  const isCalendar = pathname.startsWith("/app/calendar");
  const isContacts = pathname.startsWith("/app/contacts");
  const isMail = !isCalendar && !isContacts && pathname.startsWith("/app");

  return (
    <div id="tour-product-bar" className="w-[60px] h-full bg-black dark:bg-[#000] border-r-2 border-border-divider flex flex-col items-center py-5 shrink-0 z-20 transition-colors">
      {/* Top Icons */}
      <div className="flex flex-col gap-6 w-full items-center">
        <Link href="/app" className="cursor-pointer w-[42px] h-[42px] rounded-md bg-transparent flex items-center justify-center border border-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_0_4px_12px_rgba(0,0,0,0.8)] transition-transform hover:scale-105">
          <img src="/logo/logo-01.png" alt="Norest" className="w-[22px] h-[22px] object-contain invert brightness-0" />
        </Link>

        {/* Secondary Apps */}
        <div className="flex flex-col gap-4 mt-6">
          <Link
            href="/app"
            title="Mail"
            className={clsx("cursor-pointer w-[35px] h-[35px] rounded-md flex items-center justify-center shadow-sm group transition-all", isMail ? "bg-white text-black" : "hover:bg-bg-surface-hover text-text-tertiary hover:text-text-primary")}
          >
            <Mail size={20} className="group-hover:scale-110 transition-transform" fill="none" />
          </Link>

          <Link
            href="/app/calendar"
            title="Calendar"
            className={clsx("cursor-pointer w-[35px] h-[35px] rounded-md flex items-center justify-center group transition-all", isCalendar ? "bg-white text-black shadow-sm" : "hover:bg-bg-surface-hover text-text-tertiary hover:text-text-primary")}
          >
            <Calendar size={20} className="group-hover:scale-110 transition-transform" fill="none" />
          </Link>

          <Link
            href="/app/contacts"
            title="Contacts"
            className={clsx("cursor-pointer w-[35px] h-[35px] rounded-md flex items-center justify-center group transition-all", isContacts ? "bg-white text-black shadow-sm" : "hover:bg-bg-surface-hover text-text-tertiary hover:text-text-primary")}
          >
            <Users size={20} className="group-hover:scale-110 transition-transform" fill="none" />
          </Link>
        </div>
      </div>
    </div>
  );
}
