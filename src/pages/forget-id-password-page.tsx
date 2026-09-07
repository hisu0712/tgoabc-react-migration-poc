import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import HeaderNav from "@/components/header-nav";
import { toast } from "sonner";
import { Card } from "@/components/card";
import { SIGN_IN_PATH } from "@/lib/route";
import { PhoneInput } from "@/components/phone-input";

export default function ForgetIdPasswordPage() {
  const openAlertModal = useOpenAlertModal();
  const navigate = useNavigate();

  const { mutate: findId, isPending: isFindIdPending } = useFindId({
    onSuccess: (data) =>
      openAlertModal({
        title: "아이디 찾기",
        description: `검색결과 아이디는 아래와 같습니다. ${data.email}`,
        onPositive: () => navigate(SIGN_IN_PATH),
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
      findIdForm.reset();
    },
  });

  const { mutate: resetPassword, isPending: isResetPasswordPending } =
    useResetPassword({
      onSuccess: () => {
        toast.info("인증 메일이 잘 발송되었습니다.", {
          position: "top-center",
        });
        findPasswordForm.reset();
      },
      onError: (error) => {
        const message = generateErrorMessage(error);
        toast.error(message, {
          position: "top-center",
        });
        findPasswordForm.reset();
      },
    });

  const findIdForm = useForm<FindIdFormValues>({
    resolver: zodResolver(findIdSchema),
    defaultValues: { name: "", phone: "" },
  });

  const onFindIdSubmit = (values: FindIdFormValues) => {
    findId(values);
  };

  const findPasswordForm = useForm<FindPasswordFormValues>({
    resolver: zodResolver(findPasswordSchema),
    defaultValues: { email: "" },
  });

  const onFindPasswordSubmit = (values: FindPasswordFormValues) => {
    resetPassword(values.email);
  };

  return (
    <div>
      <HeaderNav title="아이디 / 비밀번호 찾기" />

      <Tabs defaultValue="id" className="w-full">
        <TabsList className="mb-2 w-full">
          <TabsTrigger value="id">아이디 찾기</TabsTrigger>
          <TabsTrigger value="password">비밀번호 찾기</TabsTrigger>
        </TabsList>

        <TabsContent value="id">
          <Form {...findIdForm}>
            <Card className="mb-4">
              <form
                id="find-id-form"
                className="grid gap-2"
                onSubmit={findIdForm.handleSubmit(onFindIdSubmit)}
              >
                <FormField
                  control={findIdForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>이름</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isFindIdPending}
                          placeholder="이름 입력"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={findIdForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>휴대전화</FormLabel>
                      <FormControl>
                        <PhoneInput disabled={isFindIdPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Card>

            <Button
              disabled={isFindIdPending}
              form="find-id-form"
              type="submit"
              className="w-full py-5 cursor-pointer"
            >
              아이디 찾기
            </Button>
          </Form>
        </TabsContent>

        <TabsContent value="password">
          <Form {...findPasswordForm}>
            <Card className="mb-4">
              <form
                id="find-password-form"
                onSubmit={findPasswordForm.handleSubmit(onFindPasswordSubmit)}
              >
                <FormField
                  control={findPasswordForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>이메일(아이디)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isResetPasswordPending}
                          placeholder="example@abc.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Card>

            <Button
              disabled={isResetPasswordPending}
              form="find-password-form"
              type="submit"
              className="w-full py-5 cursor-pointer"
            >
              인증 메일 요청하기
            </Button>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
