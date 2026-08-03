import { Route, Routes } from "react-router";
import IndexPage from "./pages/index-page";
import SignInPage from "./pages/sign-in-page";
import SignUpPage from "./pages/sign-up-page";
import ForgetPasswordPage from "./pages/forget-password-page";

export default function RootRoute() {
  return (
    <Routes>
      <Route path="/sign-up" element={<SignUpPage />}></Route>
      <Route path="/sign-in" element={<SignInPage />}></Route>
      <Route path="/forget-password" element={<ForgetPasswordPage />}></Route>

      <Route path="/" element={<IndexPage />}></Route>
    </Routes>
  );
}
