import { LinkCard } from "@/components/card";
import HeaderNav from "@/components/layout/header-nav";
import { ListIcon, ScissorsIcon, UserIcon } from "lucide-react";
import LogoutCard from "@/components/logout-card";

export default function SettingsPage() {
  return (
    <>
      <HeaderNav title="설정" hideBack />

      <p className="text-muted-foreground mb-1">디자이너</p>
      <div className="mb-5">
        <LinkCard
          to={"/designers"}
          className="flex cursor-pointer items-center gap-3"
        >
          <ScissorsIcon className="text-primary size-5" strokeWidth={1.5} />
          <span>디자이너 관리</span>
        </LinkCard>
      </div>

      <p className="text-muted-foreground mb-1">계정</p>
      <div className="flex flex-col gap-2">
        <LinkCard
          to={"/members/info"}
          className="flex cursor-pointer items-center gap-3"
        >
          <UserIcon className="text-primary size-5" strokeWidth={1.5} />
          <span>내 정보</span>
        </LinkCard>

        <LinkCard
          to={"/members/shop"}
          className="flex cursor-pointer items-center gap-3"
        >
          <ListIcon className="text-primary size-5" strokeWidth={1.5} />
          <span>매장 정보</span>
        </LinkCard>

        <LogoutCard />
      </div>
    </>
  );
}
