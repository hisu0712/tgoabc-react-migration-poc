import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeaderNav from "@/components/layout/header-nav";
import FindIdForm from "./components/find-id-form";
import FindPasswordForm from "./components/find-password-form";

export default function ForgetIdPasswordPage() {
  return (
    <div>
      <HeaderNav title="아이디 / 비밀번호 찾기" />

      <Tabs defaultValue="id" className="w-full">
        <TabsList className="mb-2 w-full">
          <TabsTrigger value="id">아이디 찾기</TabsTrigger>
          <TabsTrigger value="password">비밀번호 찾기</TabsTrigger>
        </TabsList>

        <TabsContent value="id">
          <FindIdForm />
        </TabsContent>

        <TabsContent value="password">
          <FindPasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
