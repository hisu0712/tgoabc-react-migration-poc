import { useActiveRole } from "@/store/active-role";

export default function AnalysisPrivacyNotice() {
  const activeRole = useActiveRole();

  return activeRole === "member" ? (
    <div className="text-muted-foreground flex flex-col text-center text-sm leading-tight font-medium">
      <span>개인정보 보호를 위해</span>
      <span>촬영 사진은 매장에 저장되지 않아요</span>
    </div>
  ) : null;
}
