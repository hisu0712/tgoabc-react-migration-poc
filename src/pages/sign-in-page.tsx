import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCompleteCustomerSignIn } from "@/hooks/mutations/auth/use-complete-customer-sign-in";
import { useSignInWithOtp } from "@/hooks/mutations/auth/use-sign-in-with-otp";
import { useSignInWithPassword } from "@/hooks/mutations/auth/use-sign-in-with-password";
import { generateErrorMessage } from "@/lib/error";
import {
  type CustomerSignInFormValues,
  customerSignInSchema,
  signInWithPasswordSchema,
  type SignInWithPasswordFormValues,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export default function SignInPage() {
  const navigate = useNavigate();

  // member
  const { mutate: signInWithPassword, isPending: isSignInWithPasswordPending } =
    useSignInWithPassword({
      onSuccess: () => navigate("/", { replace: true }),
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

  const onMemberSubmit = (values: SignInWithPasswordFormValues) => {
    signInWithPassword(values);
  };

  // customer
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const customerForm = useForm<CustomerSignInFormValues>({
    resolver: zodResolver(customerSignInSchema),
    defaultValues: { email: "" },
  });

  const { mutate: signInWithOtp, isPending: isSignInWithOtpPending } =
    useSignInWithOtp({
      onSuccess: () => {
        setIsOtpSent(true);
        toast.success("인증번호를 발송했습니다.", { position: "top-center" });
      },
      onError: (error) => {
        toast.error(generateErrorMessage(error), { position: "top-center" });
      },
    });

  const {
    mutate: completeCustomerSignIn,
    isPending: isCompleteCustomerSignInPending,
  } = useCompleteCustomerSignIn({
    onSuccess: () => navigate("/portal", { replace: true }),
    onError: async (error) => {
      if (error instanceof FunctionsHttpError) {
        const body = await error.context.json().catch(() => null);
        toast.error(
          body?.error ?? "문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
          {
            position: "top-center",
          },
        );
        return;
      }
      toast.error(generateErrorMessage(error), {
        position: "top-center",
      });
    },
  });

  const onSignInWithOtp = async () => {
    // email 필드에 걸려있는 유효성 검사 규칙을 수동으로 실행 (Promise<boolean>을 반환함)
    const isEmailValid = await customerForm.trigger("email");
    if (!isEmailValid) return;

    signInWithOtp({
      email: customerForm.getValues("email"),
      shouldCreateUser: false,
    });
  };

  const onCustomerSubmit = async (values: CustomerSignInFormValues) => {
    if (!otp) {
      toast.error("이메일 인증을 완료해주세요.", { position: "top-center" });
      return;
    }

    completeCustomerSignIn({
      email: values.email,
      token: otp,
    });
  };

  return (
    <div className="flex flex-1 flex-col justify-between">
      <Tabs defaultValue="member" className="w-full">
        <TabsList className="mb-2 w-full">
          <TabsTrigger value="member">매장</TabsTrigger>
          <TabsTrigger value="customer">고객</TabsTrigger>
        </TabsList>

        <TabsContent value="member" className="flex flex-col gap-2">
          <Form {...form}>
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
              <div>아이디 기억</div>
              <Link to={"/forget-id-password"}>아이디/비밀번호 찾기</Link>
            </div>

            <Button
              form="member-sign-in-form"
              className="py-5"
              disabled={isSignInWithPasswordPending}
              type="submit"
            >
              로그인
            </Button>
          </Form>
        </TabsContent>

        <TabsContent value="customer" className="flex flex-col gap-2">
          <Form {...customerForm}>
            <form
              id="customer-sign-in-form"
              className="mb-2"
              onSubmit={customerForm.handleSubmit(onCustomerSubmit)}
            >
              <FormField
                control={customerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="pr-5"
                          placeholder="이메일 입력"
                          {...field}
                        />
                        <Button
                          disabled={isSignInWithOtpPending}
                          type="button"
                          variant={"link"}
                          className="-transform-y-1/2 absolute top-0 right-0"
                          onClick={onSignInWithOtp}
                        >
                          인증요청
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 임시 주석 */}
              {/* {isOtpSent && ( */}
              <FormItem>
                <FormControl>
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    inputMode="numeric"
                    maxLength={6}
                    disabled={isCompleteCustomerSignInPending}
                    placeholder="인증번호 6자리 입력"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              {/* )} */}
            </form>

            <Button
              disabled={isCompleteCustomerSignInPending}
              form="customer-sign-in-form"
              className="py-5"
              type="submit"
            >
              로그인
            </Button>
          </Form>
        </TabsContent>
      </Tabs>

      <div className="mb-7">
        <p className="text-muted-foreground mb-1 text-sm">회원이 아니신가요?</p>
        <Button
          asChild
          className="bg-card text-primary hover:bg-muted w-full py-5 font-semibold"
        >
          <Link to={"/sign-up"}>회원가입 하기</Link>
        </Button>
      </div>
    </div>
  );
}
