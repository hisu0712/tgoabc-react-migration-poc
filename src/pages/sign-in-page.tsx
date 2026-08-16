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
import { useRequestCustomerSignInWithOtp } from "@/hooks/mutations/auth/use-request-customer-sign-in-with-otp";
import { useSignInWithPassword } from "@/hooks/mutations/auth/use-sign-in-with-password";
import { useVerifyCustomerSignInWithOtp } from "@/hooks/mutations/auth/use-verify-customer-sign-in-with-otp";
import { generateErrorMessage } from "@/lib/error";
import {
  type CustomerSignInFormValues,
  customerSignInSchema,
  signInWithPasswordSchema,
  type SignInWithPasswordFormValues,
} from "@/schemas/auth.schema";
import { useSession } from "@/store/session";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";
import { email } from "zod";

export default function SignInPage() {
  // member
  const { mutate: signInWithPassword, isPending: isSignInWithPasswordPending } =
    useSignInWithPassword({
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
  const [isOtpSent, setIsOtpSent] = useState(false);

  const customerForm = useForm<CustomerSignInFormValues>({
    resolver: zodResolver(customerSignInSchema),
    defaultValues: { email: "", otp: "" },
  });

  const { mutate: requestOtp, isPending: isRequestOtpPending } =
    useRequestCustomerSignInWithOtp({
      onSuccess: () => {
        setIsOtpSent(true);
        toast.success("인증번호를 발송했습니다.", { position: "top-center" });
      },
      onError: (error) => {
        toast.error(generateErrorMessage(error), { position: "top-center" });
      },
    });

  const { mutate: verifyOtp, isPending: isVerifyOtpPending } =
    useVerifyCustomerSignInWithOtp({
      onError: (error) => {
        toast.error(generateErrorMessage(error), { position: "top-center" });
      },
    });

  const onRequestOtp = async () => {
    const isEmailValid = await customerForm.trigger("email");
    if (!isEmailValid) return;
    requestOtp(customerForm.getValues("email"));
  };

  const onCustomerSubmit = (values: CustomerSignInFormValues) => {
    verifyOtp({ email: values.email, token: values.otp });
  };

  const session = useSession();
  console.log(session?.user.app_metadata.roles);

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
                          disabled={isOtpSent || isRequestOtpPending}
                          type="button"
                          variant={"link"}
                          className="-transform-y-1/2 absolute top-0 right-0"
                          onClick={onRequestOtp}
                        >
                          인증요청
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isOtpSent && (
                <FormField
                  control={customerForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={isVerifyOtpPending}
                          placeholder="인증번호"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </form>

            <Button
              disabled={!isOtpSent || isVerifyOtpPending}
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
          className="bg-card text-primary w-full py-5 font-semibold"
        >
          <Link to={"/sign-up"}>회원가입 하기</Link>
        </Button>
      </div>
    </div>
  );
}
