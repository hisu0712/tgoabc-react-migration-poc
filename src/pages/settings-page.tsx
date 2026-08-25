import { LinkCard } from "@/components/card";
import HeaderNav from "@/components/header-nav";
import { List, Scissors, User } from "lucide-react";
import { useSession } from "@/store/session";
import LogoutCard from "@/components/logout-card";

export default function SettingsPage() {
  const session = useSession();

  return (
    <>
      <HeaderNav title="설정" />

      <p className="text-muted-foreground mb-1">디자이너</p>
      <div className="mb-5">
        <LinkCard
          to={"/designers"}
          className="flex cursor-pointer items-center gap-3"
        >
          <Scissors className="text-primary size-5" strokeWidth={1.5} />
          <span>디자이너 관리</span>
        </LinkCard>
      </div>

      <p className="text-muted-foreground mb-1">계정</p>
      <div className="flex flex-col gap-2">
        <LinkCard
          to={`/members/${session?.user.id}/info`}
          className="flex cursor-pointer items-center gap-3"
        >
          <User className="text-primary size-5" strokeWidth={1.5} />
          <span>내 정보</span>
        </LinkCard>

        <LinkCard
          to={`/members/${session?.user.id}/shop`}
          className="flex cursor-pointer items-center gap-3"
        >
          <List className="text-primary size-5" strokeWidth={1.5} />
          <span>매장 정보</span>
        </LinkCard>

        <LogoutCard />
      </div>
    </>
  );
}
