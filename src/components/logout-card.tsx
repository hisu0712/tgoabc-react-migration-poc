import { signOut } from "@/api/auth";
import { useOpenAlertModal } from "@/store/alert";
import { Card } from "./card";
import { LogOut } from "lucide-react";

export default function LogoutCard() {
  const openAlertModal = useOpenAlertModal();

  const handleLogoutClick = () => {
    openAlertModal({
      title: "로그아웃",
      description: "계정 로그아웃 하시겠습니까?",
      onPositive: signOut,
    });
  };
  
  return (
    <Card
      onClick={handleLogoutClick}
      className="text-destructive flex cursor-pointer items-center gap-3"
    >
      <LogOut className="size-5" strokeWidth={1.5} />
      <span>로그아웃</span>
    </Card>
  );
}
