import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFindId } from "@/hooks/mutations/auth/use-find-id";
import { findIdSchema, type FindIdFormValues } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldErrors } from "react-hook-form";
import { toast } from "sonner";

export default function ForgetIdPasswordPage() {
  const { mutate: findId, isPending: isFindIdPending } = useFindId({
    // 성공하면 이메일 포함된 알람 모달창
    // 실패하면 에러 문구 toast 노출
  });

  const { register, handleSubmit } = useForm<FindIdFormValues>({
    resolver: zodResolver(findIdSchema),
  });

  const onFindIdSubmit = (values: FindIdFormValues) => {
    findId(values);
  };

  const onFindIdInvalid = (errors: FieldErrors<FindIdFormValues>) => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message, { position: "top-center" });
    }
  };

  return (
    <div>
      <Tabs defaultValue="id" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="id">아이디 찾기</TabsTrigger>
          <TabsTrigger value="password">비밀번호 찾기</TabsTrigger>
        </TabsList>

        <TabsContent value="id" className="w-full">
          <form onSubmit={handleSubmit(onFindIdSubmit, onFindIdInvalid)}>
            <Input
              disabled={isFindIdPending}
              placeholder="이름 입력"
              {...register("name")}
            />
            <Input
              disabled={isFindIdPending}
              placeholder="휴대전화 번호를 -없이 입력해주세요"
              {...register("phone")}
            />

            <Button type="submit">아이디 찾기</Button>
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
