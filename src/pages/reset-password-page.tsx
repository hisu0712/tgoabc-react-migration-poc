import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdatePassword } from "@/hooks/mutations/auth/use-update-password";
import { generateErrorMessage } from "@/lib/error";
import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const { mutate: updatePassword, isPending: isUpdatePasswordPending } =
    useUpdatePassword({
      onSuccess: () => {
        toast.info("비밀번호가 성공적으로 변경되었습니다.", {
          position: "top-center",
        });
        navigate("/", { replace: true });
      },
      onError: (error) => {
        const message = generateErrorMessage(error);
        toast.error(message, {
          position: "top-center",
        });
        form.reset();
      },
    });

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", repassword: "" },
  });

  const onResetPasswordSubmit = (values: ResetPasswordFormValues) => {
    updatePassword(values.password);
  };

  return (
    <div>
      <h1>비밀번호 변경</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onResetPasswordSubmit)}>
          {/* 여기에 회원 정보의 비밀번호 변경 페이지에서 넘어왔다면 기존 비밀번호 입력란 만들어서 auth와 확인 필요 */}
          {/* signInWithPassword로 재인증 */}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>신규 비밀번호</FormLabel>
                <FormControl>
                  <Input
                    disabled={isUpdatePasswordPending}
                    type="password"
                    placeholder="새로운 비밀번호 입력"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="repassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호 확인</FormLabel>
                <FormControl>
                  <Input
                    disabled={isUpdatePasswordPending}
                    type="password"
                    placeholder="새로운 비밀번호 입력"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isUpdatePasswordPending} type="submit">
            변경하기
          </Button>
        </form>
      </Form>
    </div>
  );
}
