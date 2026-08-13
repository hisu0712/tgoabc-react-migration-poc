import { Navigate, Route, Routes } from "react-router";
import IndexPage from "./pages/index-page";
import SignInPage from "./pages/sign-in-page";
import SignUpPage from "./pages/sign-up-page";
import ForgetIdPasswordPage from "./pages/forget-id-password-page";
import SignUpCompletePage from "./pages/sign-up-complete";
import GuestOnlyLayout from "./components/layout/guest-only-layout";
import MemberOnlyLayout from "./components/layout/member-only-layout";
import CustomerDetailPage from "./pages/customer-detail-page";
import CustomerNewPage from "./pages/customer-new-page";
import CustomerInfoPage from "./pages/customer-info-page";
import CustomerListPage from "./pages/customer-list-page";
import MemberInfoPage from "./pages/member-info-page";
import PersonalAnalysisResultPage from "./pages/personal-analysis-result-page";
import PersonalAnalysisPhotoPage from "./pages/personal-analysis-photo-page";
import MemberShopPage from "./pages/member-shop-page";
import ResetPasswordPage from "./pages/reset-password-page";
import GlobalLayout from "./components/layout/global-layout";
import GlobalLayoutWithBottomNav from "./components/layout/global-layout-with-bottom-nav";

export default function RootRoute() {
  return (
    <Routes>
      <Route element={<GuestOnlyLayout />}>
        <Route element={<GlobalLayout />}>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route
            path="/forget-id-password"
            element={<ForgetIdPasswordPage />}
          />
        </Route>
      </Route>

      <Route element={<MemberOnlyLayout />}>
        <Route element={<GlobalLayout />}>
          <Route path="/sign-up/complete" element={<SignUpCompletePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/members/:memberId/info" element={<MemberInfoPage />} />
          <Route path="/members/:memberId/shop" element={<MemberShopPage />} />

          <Route path="/customers/new" element={<CustomerNewPage />} />
          <Route
            path="/customers/:customerId/edit"
            element={<CustomerInfoPage />}
          />
        </Route>

        <Route element={<GlobalLayoutWithBottomNav />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/customers" element={<CustomerListPage />} />
          <Route
            path="/customers/:customerId"
            element={<CustomerDetailPage />}
          />
        </Route>

        {/* /personal-analysis/photo?customerId=123 쿼리스트링 사용 예정 */}
        <Route
          path="/personal-analysis/photo"
          element={<PersonalAnalysisPhotoPage />}
        />
        <Route
          path="/personal-analysis/:resultId"
          element={<PersonalAnalysisResultPage />}
        />
      </Route>

      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
  );
}
