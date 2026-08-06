import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFindId } from "@/hooks/mutations/auth/use-find-id";
import { useResetPassword } from "@/hooks/mutations/auth/use-reset-password-for-email";
import { generateErrorMessage } from "@/lib/error";
import {
  findIdSchema,
  findPasswordSchema,
  type FindIdFormValues,
  type FindPasswordFormValues,
} from "@/schemas/auth.schema";
import { useOpenAlertModal } from "@/store/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { useForm, type FieldErrors } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function ForgetIdPasswordPage() {
  const openAlertModal = useOpenAlertModal();
  const navigate = useNavigate();

  const { mutate: findId, isPending: isFindIdPending } = useFindId({
    onSuccess: (data) =>
      openAlertModal({
        title: "아이디 찾기",
        description: `검색결과 아이디는 아래와 같습니다. ${data.email}`,
        onPositive: () => navigate("/sign-in"),
      }),
    onError: async (error) => {
      if (error instanceof FunctionsHttpError) {
        const errorBody = await error.context.json();
        toast.error(errorBody.error, { position: "top-center" });
      } else {
        toast.error("알 수 없는 오류가 발생했습니다.", {
          position: "top-center",
        });
      }
      resetFindIdField();
    },
  });

  const { mutate: resetPassword, isPending: isResetPasswordPending } =
    useResetPassword({
      onSuccess: () => {
        toast.info("인증 메일이 잘 발송되었습니다.", {
          position: "top-center",
        });
        resetFindPasswordField();
      },
      onError: (error) => {
        const message = generateErrorMessage(error);
        toast.error(message, {
          position: "top-center",
        });
        resetFindPasswordField();
      },
    });

  const {
    register: registerFindId,
    handleSubmit: handleFindIdSubmit,
    reset: resetFindIdField,
  } = useForm<FindIdFormValues>({
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

  const {
    register: registerFindPassword,
    handleSubmit: handleFindPasswordSubmit,
    reset: resetFindPasswordField,
  } = useForm<FindPasswordFormValues>({
    resolver: zodResolver(findPasswordSchema),
  });

  const onFindPasswordSubmit = (values: FindPasswordFormValues) => {
    resetPassword(values.email);
  };
  const onFindPasswordInvalid = (
    errors: FieldErrors<FindPasswordFormValues>,
  ) => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message, { position: "top-center" });
    }
  };

  return (
    <div>
      <Tabs defaultValue="password" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="id">아이디 찾기</TabsTrigger>
          <TabsTrigger value="password">비밀번호 찾기</TabsTrigger>
        </TabsList>

        <TabsContent value="id" className="w-full">
          <form onSubmit={handleFindIdSubmit(onFindIdSubmit, onFindIdInvalid)}>
            <Input
              disabled={isFindIdPending}
              placeholder="이름 입력"
              {...registerFindId("name")}
            />
            <Input
              disabled={isFindIdPending}
              placeholder="휴대전화 번호를 -없이 입력해주세요"
              {...registerFindId("phone")}
            />

            <Button type="submit">아이디 찾기</Button>
          </form>
        </TabsContent>

        <TabsContent value="password">
          <form
            onSubmit={handleFindPasswordSubmit(
              onFindPasswordSubmit,
              onFindPasswordInvalid,
            )}
          >
            <Input
              disabled={isResetPasswordPending}
              placeholder="example@abc.com"
              {...registerFindPassword("email")}
            />

            <Button type="submit">인증 메일 요청하기</Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
