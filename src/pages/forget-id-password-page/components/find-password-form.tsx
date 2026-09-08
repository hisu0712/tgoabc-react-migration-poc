import { Card } from "@/components/card";
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
import { useResetPassword } from "@/hooks/mutations/auth/use-reset-password-for-email";
import { generateErrorMessage } from "@/lib/error";
import {
  findPasswordSchema,
  type FindPasswordFormValues,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function FindPasswordForm() {
  const findPasswordForm = useForm<FindPasswordFormValues>({
    resolver: zodResolver(findPasswordSchema),
    defaultValues: { email: "" },
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

  const onFindPasswordSubmit = (values: FindPasswordFormValues) => {
    resetPassword(values.email);
  };

  return (
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
        className="w-full cursor-pointer py-5"
      >
        인증 메일 요청하기
      </Button>
    </Form>
  );
}
