import { toastComingSoon } from "@/lib/toast";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export default function BottomNav({ navItems }: { navItems: NavItem[] }) {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-10 w-full">
      <nav className="bg-card rounded-t-[21px] shadow-[0px_0px_10px_rgba(0,0,0,0.15)]">
        <ul className="flex">
          {navItems.map(({ to, label, icon: Icon, disabled }) => (
            <li key={label} className="w-1/4 pb-1">
              <NavLink
                onClick={disabled ? toastComingSoon : undefined}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-2 py-3 ${isActive && !disabled ? "text-primary" : "text-muted-foreground"}`
                }
              >
                <Icon className="size-6" strokeWidth={1.5} />
                <span className="text-xs">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
