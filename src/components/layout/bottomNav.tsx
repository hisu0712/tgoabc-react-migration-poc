import { signOut } from "@/api/auth";
import { useOpenAlertModal } from "@/store/alert";
import { BarChart, Home, LogOut, Users } from "lucide-react";
import { NavLink } from "react-router";

const NAV_ITEMS = [
  { to: "/", label: "홈", icon: Home },
  { to: "/customers", label: "고객목록", icon: Users },
  { to: "/dashboard", label: "대시보드", icon: BarChart },
];

export default function BottomNav() {
  const openAlertModal = useOpenAlertModal();

  const handleLogoutClick = () => {
    openAlertModal({
      title: "로그아웃",
      description: "계정 로그아웃 하시겠습니까?",
      onPositive: signOut,
    });
  };

  return (
    <footer className="fixed inset-x-0 bottom-0 z-[101] w-full">
      <nav className="bg-card rounded-t-[21px] shadow-[0px_0px_10px_rgba(0,0,0,0.15)]">
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
          <li className="w-1/4 pb-1">
            <button
              type="button"
              onClick={handleLogoutClick}
              className="text-muted-foreground flex w-full flex-col items-center gap-2 py-3"
            >
              <LogOut className="size-6" strokeWidth={1.5} />
              <span className="text-xs">로그아웃</span>
            </button>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
