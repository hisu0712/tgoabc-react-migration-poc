import { LinkCard } from "@/components/card";
import HeaderNav from "@/components/layout/header-nav";
import { UserIcon } from "lucide-react";
import LogoutCard from "@/components/logout-card";

export default function PortalSettingsPage() {
  return (
    <>
      <HeaderNav title="설정" hideBack />

      <p className="text-muted-foreground mb-1">계정</p>
      <div className="flex flex-col gap-2">
        <LinkCard
          to={"/portal-info"}
          className="flex cursor-pointer items-center gap-3"
        >
          <UserIcon className="text-primary size-5" strokeWidth={1.5} />
          <span>내 정보</span>
        </LinkCard>

        <LogoutCard />
      </div>
    </>
  );
}
