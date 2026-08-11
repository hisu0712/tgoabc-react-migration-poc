import { BarChart, Home, Settings, Users } from "lucide-react";
import { NavLink } from "react-router";

const NAV_ITEMS = [
  { to: "/", label: "홈", icon: Home },
  { to: "/customers", label: "고객목록", icon: Users },
  { to: "/dashboard", label: "대시보드", icon: BarChart },
  { to: "/settings", label: "설정", icon: Settings },
];

export default function BottomNav() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-[101] w-full">
      <nav className="rounded-t-[21px] bg-card shadow-[0px_0px_10px_rgba(0,0,0,0.15)]">
        <ul className="flex">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to} className="w-1/4 pb-1">
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-2 py-3 ${isActive ? "text-primary" : "text-muted-foreground"}`
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
