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
    <div>
      <div className="bl_ani bl_ani__auth">
        <div className="bl_txtAni">
          <div
            className="bl_txtAni_ttl js_txtAni"
            data-i18n="shop.50"
            data-username="티고뷰티샵"
          >
            회원가입 완료!
            <br />
            {shop.name} 님 반갑습니다
          </div>
          <div className="bl_txtAni_desc js_txtAni" data-i18n="shop.51">
            티고ABC의 소중한 회원이 되어주셔서 감사합니다
          </div>
        </div>
        <div className="bl_imgAni">
          <div className="bl_imgAni_inner">
            <img src={surveyOutro} alt="축하하는 우끼 캐릭터 이미지" />
          </div>
        </div>
      </div>

      <BottomButton onClick={() => navigate("/", { replace: true })}>
        다음
      </BottomButton>
    </div>
  );
}
