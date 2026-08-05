import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSignInWithPassword } from "@/hooks/mutations/auth/use-sign-in-with-password";
import { generateErrorMessage } from "@/lib/error";
import {
  signInWithPasswordSchema,
  type SignInWithPasswordFormValues,
} from "@/schemas/auth.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldErrors } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";

export default function SignInPage() {
  const { mutate: signInWithPassword, isPending: isSignInWithPasswordPending } =
    useSignInWithPassword({
      onError: (error) => {
        const message = generateErrorMessage(error);
        toast.error(message, {
          position: "top-center",
        });
      },
    });

  const { register, handleSubmit } = useForm<SignInWithPasswordFormValues>({
    resolver: zodResolver(signInWithPasswordSchema),
  });

  const onMemberSubmit = (values: SignInWithPasswordFormValues) => {
    signInWithPassword(values);
  };

  const onMemberInvalid = (
    errors: FieldErrors<SignInWithPasswordFormValues>,
  ) => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message, { position: "top-center" });
    }
  };

  return (
    <div>
      <Tabs defaultValue="member" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="member">매장</TabsTrigger>
          <TabsTrigger value="customer">고객</TabsTrigger>
        </TabsList>

        <TabsContent value="member" className="flex flex-col gap-2">
          <form onSubmit={handleSubmit(onMemberSubmit, onMemberInvalid)}>
            <Input
              disabled={isSignInWithPasswordPending}
              placeholder="이메일(아이디) 입력"
              {...register("email")}
            />
            <Input
              disabled={isSignInWithPasswordPending}
              type="password"
              placeholder="비밀번호 입력"
              {...register("password")}
            />

            <div className="flex justify-between">
              <div>아이디 기억</div>
              <Link to={"/forget-id-password"}>아이디/비밀번호 찾기</Link>
            </div>

            <Button disabled={isSignInWithPasswordPending} type="submit">
              로그인
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="customer" className="flex flex-col gap-2">
          <Input placeholder="이메일 입력" />
          <Input placeholder="인증번호" />
        </TabsContent>
      </Tabs>

      <div>
        <p>회원이 아니신가요?</p>
        <Link to={"/sign-up"}>회원가입 하기</Link>
      </div>
    </div>
  );
}
