import {
  signInWithPasswordSchema,
  type SignInWithPasswordFormValues,
} from "@/schemas/auth.schema";
import { useSignInWithPassword } from "@/hooks/mutations/auth/use-sign-in-with-password";
import { CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateErrorMessage } from "@/lib/error";
import { toast } from "sonner";
import { TabsContent } from "./ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";

const REMEMBERED_ID_KEY = "rememberedId";

export default function SignInMemberForm() {
  const navigate = useNavigate();
  const [rememberId, setRememberId] = useState(false);

  const { mutate: signInWithPassword, isPending: isSignInWithPasswordPending } =
    useSignInWithPassword({
      onSuccess: () => {
        console.log("onSuccess 호추됨")
        if (rememberId) {
          localStorage.setItem(REMEMBERED_ID_KEY, form.getValues("email"));
        } else {
          localStorage.removeItem(REMEMBERED_ID_KEY);
        }
        navigate("/", { replace: true });
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
    <TabsContent
      value="member"
      className="flex flex-1 flex-col justify-between"
    >
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
                    <Input
                      disabled={isSignInWithPasswordPending}
                      className="h-auto py-2"
                      type="password"
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
            className="h-auto py-2.5 text-base"
            disabled={isSignInWithPasswordPending}
            type="submit"
          >
            로그인
          </Button>
        </div>
      </Form>

      <div className="mb-7">
        <p className="text-muted-foreground mb-1 text-sm">회원이 아니신가요?</p>
        <Button
          asChild
          className="bg-card text-primary hover:bg-muted h-auto w-full py-2.5 text-base"
        >
          <Link to={"/sign-up"}>회원가입 하기</Link>
        </Button>
      </div>
    </TabsContent>
  );
}
