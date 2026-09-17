import BottomButton from "@/components/layout/bottom-button";
import HeaderNav from "@/components/layout/header-nav";
import { Form } from "@/components/ui/form";
import { useUpdatePassword } from "@/hooks/mutations/auth/use-update-password";
import { generateErrorMessage } from "@/lib/error";
import { MEMBER_HOME_PATH } from "@/lib/route";
import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toastError, toastSuccess } from "@/lib/toast";
import PasswordFields from "@/components/fields/password-fields";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const { mutate: updatePassword, isPending: isUpdatePasswordPending } =
    useUpdatePassword({
      onSuccess: () => {
        toastSuccess("비밀번호가 성공적으로 변경되었습니다.");
        navigate(MEMBER_HOME_PATH, { replace: true });
      },
      onError: (error) => {
        const message = generateErrorMessage(error);
        toastError(message);
        form.reset();
      },
    });

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", rePassword: "" },
  });

  const onResetPasswordSubmit = (values: ResetPasswordFormValues) => {
    updatePassword(values.newPassword);
  };

  return (
    <>
      <HeaderNav title="비밀번호 재설정" />

      <Form {...form}>
        <form
          id="reset-password-form"
          onSubmit={form.handleSubmit(onResetPasswordSubmit)}
          className="grid gap-3"
        >
          <PasswordFields disabled={isUpdatePasswordPending} />
        </form>
      </Form>

      <BottomButton
        form="reset-password-form"
        disabled={isUpdatePasswordPending}
        type="submit"
        loading={isUpdatePasswordPending}
      >
        적용하기
      </BottomButton>
    </>
  );
}
