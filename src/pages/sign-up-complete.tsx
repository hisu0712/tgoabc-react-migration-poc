import GlobalLoader from "@/components/global-loader";
import { Button } from "@/components/ui/button";
import { useShopData } from "@/hooks/hooks/queries/use-shop-data";
import { useSession } from "@/store/session";
import { Navigate, useNavigate } from "react-router";

export default function SignUpCompletePage() {
  const navigate = useNavigate();
  const session = useSession();

  const {
    data: shop,
    error: fetchShopError,
    isPending: isFetchShopPending,
  } = useShopData(session!.user.id);

  if (isFetchShopPending) return <GlobalLoader />;
  if (fetchShopError) return <Navigate to={"/"} replace={true} />;

  return (
    <div>
      <p>회원가입 완료!</p>
      <p>{shop.name} 님 반갑습니다</p>
      <p>티고ABC의 소중한 회원이 되어주셔서 감사합니다</p>

      <Button onClick={() => navigate("/", { replace: true })}>다음</Button>
    </div>
  );
}
