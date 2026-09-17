import PasswordFields from "@/components/fields/password-fields";
import { PasswordInput } from "@/components/form/password-input";
import BottomButton from "@/components/layout/bottom-button";
import HeaderNav from "@/components/layout/header-nav";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useChangePassword } from "@/hooks/mutations/auth/use-change-password";
import { generateErrorMessage } from "@/lib/error";
import { MEMBER_HOME_PATH } from "@/lib/route";
import { toastError, toastSuccess } from "@/lib/toast";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/schemas/auth.schema";
import { useSession } from "@/store/session";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export default function MemberPasswordPage() {
  const session = useSession();
  const navigate = useNavigate();

  const { mutate: changePassword, isPending: isChangePasswordPending } =
    useChangePassword({
      onSuccess: () => {
        toastSuccess("비밀번호가 성공적으로 변경되었습니다.");
        navigate("/members/info", { replace: true });
      },
      onError: (error) => {
        const message = generateErrorMessage(error);
        toastError(message);
      },
    });

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", rePassword: "" },
  });

  const onChangePasswordSubmit = (values: ChangePasswordFormValues) => {
    changePassword({
      email: session!.user.email!,
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  return (
    <>
      <HeaderNav title="비밀번호 변경" />

      <Form {...form}>
        <form
          id="change-password-form"
          onSubmit={form.handleSubmit(onChangePasswordSubmit)}
          className="grid gap-3"
        >
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>기존 비밀번호</FormLabel>
                <FormControl>
                  <PasswordInput
                    disabled={isChangePasswordPending}
                    placeholder="비밀번호 입력"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <PasswordFields disabled={isChangePasswordPending} />
        </form>
      </Form>

      <BottomButton
        form="change-password-form"
        disabled={isChangePasswordPending}
        type="submit"
        loading={isChangePasswordPending}
      >
        변경하기
      </BottomButton>
    </>
  );
}
