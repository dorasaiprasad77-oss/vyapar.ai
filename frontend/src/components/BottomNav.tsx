"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ReceiptText, Package2, Mic, Settings } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  // Hide nav on landing page or login page
  if (pathname === "/" || pathname === "/login") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center p-3 sm:hidden z-50">
      <NavItem href="/dashboard" icon={<Home size={24} />} label="Home" current={pathname} />
      <NavItem href="/billing" icon={<ReceiptText size={24} />} label="Bill" current={pathname} />
      <NavItem href="/assistant" icon={<Mic size={32} className="text-blue-600" />} label="AI" current={pathname} />
      <NavItem href="/inventory" icon={<Package2 size={24} />} label="Stock" current={pathname} />
      <NavItem href="/insights" icon={<Settings size={24} />} label="More" current={pathname} />
    </div>
  );
}

function NavItem({ href, icon, label, current }: { href: string; icon: React.ReactNode; label: string; current: string }) {
  const isActive = current === href;
  return (
    <Link href={href} className={`flex flex-col items-center gap-1 ${isActive ? "text-blue-600 font-bold" : "text-gray-500"}`}>
      {icon}
      <span className="text-[10px] uppercase tracking-wide">{label}</span>
    </Link>
  );
}
