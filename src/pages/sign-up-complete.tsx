import BottomButton from "@/components/bottom-button";
import GlobalLoader from "@/components/global-loader";
import { useShopData } from "@/hooks/queries/use-shop-data";
import { useSession } from "@/store/session";
import { Navigate, useNavigate } from "react-router";
import surveyOutro from "@/assets/survey_outro.gif";

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
    <>
      <div className="flex flex-1 flex-col gap-[5vh] pt-[10vh]">
        <div>
          <div className="mb-1 text-2xl font-bold" data-username="티고뷰티샵">
            회원가입 완료!
            <br />
            {shop.name} 님 반갑습니다
          </div>
          <div className="text-muted-foreground text-lg font-medium">
            티고ABC의 소중한 회원이 되어주셔서 감사합니다
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <img
            className="w-full md:w-[70%]"
            src={surveyOutro}
            alt="축하하는 우끼 캐릭터 이미지"
          />
        </div>
      </div>

      <BottomButton onClick={() => navigate("/", { replace: true })}>
        다음
      </BottomButton>
    </>
  );
}
