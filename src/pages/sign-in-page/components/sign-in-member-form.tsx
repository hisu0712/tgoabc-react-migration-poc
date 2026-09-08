import {
  signInWithPasswordSchema,
  type SignInWithPasswordFormValues,
} from "@/schemas/auth.schema";
import { useSignInWithPassword } from "@/hooks/mutations/auth/use-sign-in-with-password";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateErrorMessage } from "@/lib/error";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/form/password-input";
import { useSetActiveRole } from "@/store/active-role";

const REMEMBERED_ID_KEY = "rememberedId";

export default function SignInMemberForm() {
  const setActiveRole = useSetActiveRole();
  const [rememberId, setRememberId] = useState(false);

  const { mutate: signInWithPassword, isPending: isSignInWithPasswordPending } =
    useSignInWithPassword({
      onSuccess: () => {
        if (rememberId) {
          localStorage.setItem(REMEMBERED_ID_KEY, form.getValues("email"));
        } else {
          localStorage.removeItem(REMEMBERED_ID_KEY);
        }
        setActiveRole("member");
      },
      onError: (error) => {
        const message = generateErrorMessage(error);
        toast.error(message, {
          position: "top-center",
        });
      },
    });

  const form = useForm<SignInWithPasswordFormValues>({
    resolver: zodResolver(signInWithPasswordSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBERED_ID_KEY);
    if (saved) {
      form.setValue("email", saved);
      setRememberId(true);
    }
  }, [form]);

  const onMemberSubmit = (values: SignInWithPasswordFormValues) => {
    signInWithPassword(values);
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-3">
        <form
          id="member-sign-in-form"
          className="flex flex-col gap-1"
          onSubmit={form.handleSubmit(onMemberSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={isSignInWithPasswordPending}
                    className="h-auto py-2"
                    placeholder="이메일(아이디) 입력"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    disabled={isSignInWithPasswordPending}
                    className="h-auto py-2"
                    placeholder="비밀번호 입력"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>

        <div className="text-muted-foreground mb-0.5 flex justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-1">
            <Checkbox
              checked={rememberId}
              onCheckedChange={(checked) => setRememberId(!!checked)}
            />
            <span>아이디 기억</span>
          </label>
          <Link to={"/forget-id-password"}>아이디/비밀번호 찾기</Link>
        </div>

        <Button
          form="member-sign-in-form"
          className="h-auto cursor-pointer py-2.5 text-base"
          disabled={isSignInWithPasswordPending}
          type="submit"
        >
          로그인
        </Button>
      </div>
    </Form>
  );
}
