import { toastComingSoon } from "@/lib/toast";
import { cn } from "@/lib/utils";
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
      <nav className="bg-card rounded-t-2xl shadow-[0px_0px_10px_rgba(0,0,0,0.15)]">
        <ul className="flex">
          {navItems.map(({ to, label, icon: Icon, disabled }) => (
            <li key={label} className="w-1/4">
              <NavLink
                onClick={disabled ? toastComingSoon : undefined}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-1 py-2.5",
                    isActive && !disabled
                      ? "text-primary font-semibold"
                      : "text-muted-foreground",
                  )
                }
              >
                <Icon className="size-5" strokeWidth={1.5} />
                <span className="text-xs">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
