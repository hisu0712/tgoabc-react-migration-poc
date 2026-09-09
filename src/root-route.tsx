import { Route, Routes } from "react-router";
import IndexPage from "./pages/index-page";
import SignInPage from "./pages/sign-in-page";
import SignUpPage from "./pages/sign-up-page";
import ForgetIdPasswordPage from "./pages/forget-id-password-page";
import SignUpCompletePage from "./pages/sign-up-complete";
import GuestOnlyLayout from "./components/layout/guest-only-layout";
import MemberOnlyLayout from "./components/layout/member-only-layout";
import CustomerDetailPage from "./pages/customer-page";
import CustomerNewPage from "./pages/customer-new-page";
import CustomerInfoPage from "./pages/customer-info-page";
import CustomerListPage from "./pages/customer-list-page";
import MemberInfoPage from "./pages/member-info-page";
import AnalysisResultPage from "./pages/analysis-result-page";
import AnalysisPhotoPage from "./pages/analysis-photo-page";
import MemberShopPage from "./pages/member-shop-page";
import ResetPasswordPage from "./pages/reset-password-page";
import GlobalLayout from "./components/layout/global-layout";
import GlobalLayoutWithBottomNav from "./components/layout/global-layout-with-bottom-nav";
import PortalPage from "./pages/portal-page";
import CustomerOnlyLayout from "./components/layout/customer-only-layout";
import DesignerPage from "./pages/designer-page";
import { PortalInfoPage } from "./pages/portal-info-page";
import SettingsPage from "./pages/settings-page";
import PortalSettingsPage from "./pages/portal-settings-page";
import AnalysisProcessPage from "./pages/analysis-process-page";
import UserOnlyLayout from "./components/layout/user-only-layout";
import FallbackRedirect from "./components/fallback-redirect";
import {
  CUSTOMER_HOME_PATH,
  MEMBER_HOME_PATH,
  SIGN_IN_PATH,
} from "./lib/route";
import AnalysisSharedPage from "./pages/analysis-shared-page";
import DashboardPage from "./pages/dashboard-page";
import AnalysisListPage from "./pages/analysis-list-page";
import { CUSTOMER_NAV_ITEMS, MEMBER_NAV_ITEMS } from "./constants/nav";

export default function RootRoute() {
  return (
    <Routes>
      {/* GuestOnlyLayout */}
      <Route element={<GuestOnlyLayout />}>
        <Route path={SIGN_IN_PATH} element={<SignInPage />} />
        <Route element={<GlobalLayout />}>
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route
            path="/forget-id-password"
            element={<ForgetIdPasswordPage />}
          />
        </Route>
      </Route>

      {/* MemberOnlyLayout */}
      <Route element={<MemberOnlyLayout />}>
        <Route element={<GlobalLayout />}>
          <Route path="/sign-up/complete" element={<SignUpCompletePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/members/info" element={<MemberInfoPage />} />
          <Route path="/members/shop" element={<MemberShopPage />} />

          <Route path="/customers/new" element={<CustomerNewPage />} />
          <Route
            path="/customers/:customerId/info"
            element={<CustomerInfoPage />}
          />
        </Route>

        <Route
          element={<GlobalLayoutWithBottomNav navItems={MEMBER_NAV_ITEMS} />}
        >
          <Route path={MEMBER_HOME_PATH} element={<IndexPage />} />
          <Route path="/customers" element={<CustomerListPage />} />
          <Route
            path="/customers/:customerId"
            element={<CustomerDetailPage />}
          />
          <Route path="/designers" element={<DesignerPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* CustomerOnlyLayout */}
      <Route element={<CustomerOnlyLayout />}>
        <Route
          element={<GlobalLayoutWithBottomNav navItems={CUSTOMER_NAV_ITEMS} />}
        >
          <Route path={CUSTOMER_HOME_PATH} element={<PortalPage />} />
          <Route path="/portal-settings" element={<PortalSettingsPage />} />
          <Route path="/portal-analysis/list" element={<AnalysisListPage />} />
        </Route>
        <Route element={<GlobalLayout />}>
          <Route path="/portal-info" element={<PortalInfoPage />} />
        </Route>
      </Route>

      {/* UserOnlyLayout */}
      <Route element={<UserOnlyLayout />}>
        {/* /analysis/photo?customerId=123 */}
        <Route path="/analysis/photo" element={<AnalysisPhotoPage />} />{" "}
        {/* /analysis/:analysisId/prcess?customerId=123&imageUrl=123 */}
        <Route
          path="/analysis/:analysisId/process"
          element={<AnalysisProcessPage />}
        />
        <Route path="/analysis/:analysisId" element={<AnalysisResultPage />} />
      </Route>

      {/* public */}
      <Route
        path="/share/analysis/:analysisId"
        element={<AnalysisSharedPage />}
      />

      <Route path="*" element={<FallbackRedirect />} />
    </Routes>
  );
}
