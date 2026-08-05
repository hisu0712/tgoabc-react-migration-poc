import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ForgetIdPasswordPage() {
  return (
    <div>
      <Tabs defaultValue="id" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="id">아이디 찾기</TabsTrigger>
          <TabsTrigger value="password">비밀번호 찾기</TabsTrigger>
        </TabsList>

        <TabsContent value="id" className="w-full">
          <form>
            <Input placeholder="이름 입력" />
            <Input placeholder="휴대전화 번호를 -없이 입력해주세요" />

            <Button>아이디 찾기</Button>
          </form>
        </TabsContent>

        <TabsContent value="password">
          <form>
            <Input placeholder="이름 입력" />
            <Input placeholder="example@abc.com" />
            <Input placeholder="휴대전화 번호를 -없이 입력해주세요" />

            <Button>임시 비밀번호 발급</Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
