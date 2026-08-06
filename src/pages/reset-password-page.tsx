import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdatePassword } from "@/hooks/mutations/auth/use-update-password";
import { generateErrorMessage } from "@/lib/error";
import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldErrors } from "react-hook-form";
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
        reset();
      },
    });

  const { register, handleSubmit, reset } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onResetPasswordSubmit = (values: ResetPasswordFormValues) => {
    updatePassword(values.password);
  };
  const onResetPasswordInvalid = (
    errors: FieldErrors<ResetPasswordFormValues>,
  ) => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message, { position: "top-center" });
    }
  };

  return (
    <div>
      <h1>비밀번호 변경</h1>

      <form
        onSubmit={handleSubmit(onResetPasswordSubmit, onResetPasswordInvalid)}
      >
        <p>신규 비밀번호</p>
        <Input
          disabled={isUpdatePasswordPending}
          type="password"
          placeholder="새로운 비밀번호 입력"
          {...register("password")}
        />
        <p>비밀번호 확인</p>
        <Input
          disabled={isUpdatePasswordPending}
          type="password"
          placeholder="비밀번호 재입력"
          {...register("repassword")}
        />

        <Button type="submit">변경하기</Button>
      </form>
    </div>
  );
}
