import { useSession } from "@/store/session";
import { Link } from "react-router";

export default function IndexPage() {
  const session = useSession();

  return (
    <div>
      <main className="ly_content">
        <div className="bl_info hp_flexSbCenter hp_mbXL">
          <div className="hp_flexCol">
            <p className="bl_info_msg hp_mbXXS">오늘의 분석을 시작해보세요</p>
            <Link
              to={`/members/${session?.user.id}/info`}
              className="bl_info_user hp_mbXS"
            >
              티고뷰티샵 님
            </Link>
            <div className="ly_flex hp_gapXXS">
              <svg className="el_icon el_icon__barChartS hp_cDarkGray">
                <use href="/assets/icon/svg/sprite.svg#ico_barChart"></use>
              </svg>
              <p className="el_caption">고객 12명 · 분석수 128건</p>
            </div>
          </div>
          <div className="bl_info_logo">
            <img src="/assets/images/customer_profile__joa.png" alt="" />
            <span className="bl_info_plus"></span>
          </div>
        </div>
        <div className="bl_card bl_add">
          <img src="/assets/icon/ico_addCustomer.svg" />
          <div>
            <div className="hp_fwSb hp_mbXXS">고객 추가하기</div>
            <div className="hp_fzS hp_fwR hp_op80">
              빠른 고객 정보 입력 후 등록!
            </div>
          </div>
        </div>

        {/* 분석 메뉴 */}
        <div className="ly_grid bl_mainMenu_unit">
          <div className="bl_card bl_mainMenu">
            <div>
              <div className="hp_cBlue hp_mbXXS">
                <div className="el_title">두피 분석</div>
                <div className="el_title">바로가기</div>
              </div>
              <div className="el_caption">바로 시작하기</div>
            </div>
            <div className="bl_mainMenu_img">
              <img src="/assets/images/test_menuS.png" alt="" />
            </div>
          </div>
          <div className="bl_card bl_mainMenu">
            <div>
              <div className="hp_cPurple hp_mbXXS">
                <div className="el_title">퍼스널 컬러</div>
                <div className="el_title">바로가기</div>
              </div>
              <div className="el_caption">나의 퍼스널 컬러는?</div>
            </div>
            <div className="bl_mainMenu_img">
              <img src="/assets/images/test_menuP.png" alt="" />
            </div>
          </div>
        </div>

        {/* 최근 분석 목록 (최대 5명) */}
        <div className="hp_fzL hp_fwSb hp_mbXS">최근 분석 목록</div>
        <div className="bl_menuRecent js_swiperCustomer">
          <div className="swiper-wrapper">
            <div className="swiper-slide bl_listCard bl_card">
              <div className="el_roundMark el_roundMark__blue">K</div>
              <div className="bl_listCard_ttl">김티젠</div>
            </div>
            <div className="swiper-slide bl_listCard bl_card">
              <div className="el_roundMark el_roundMark__red">D</div>
              <div className="bl_listCard_ttl">김티고</div>
            </div>
            <div className="swiper-slide bl_listCard bl_card">
              <div className="el_roundMark el_roundMark__blue">K</div>
              <div className="bl_listCard_ttl">김티나</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
