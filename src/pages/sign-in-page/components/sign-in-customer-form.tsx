import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type CustomerSignInFormValues,
  customerSignInSchema,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { useCompleteCustomerSignIn } from "@/hooks/mutations/auth/use-complete-customer-sign-in";
import { useSignInWithOtp } from "@/hooks/mutations/auth/use-sign-in-with-otp";
import { generateErrorMessage } from "@/lib/error";
import { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { useSetActiveRole } from "@/store/active-role";

export default function SignInCustomerForm() {
  const setActiveRole = useSetActiveRole();

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
    onSuccess: () => setActiveRole("customer"),
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

  useEffect(() => {
    if (otp.length === 6 && !isCompleteCustomerSignInPending) {
      customerForm.handleSubmit(onCustomerSubmit)();
    }
  }, [otp]);

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
    <TabsContent value="customer" className="flex flex-col gap-2">
      <Form {...customerForm}>
        <form
          id="customer-sign-in-form"
          className="mb-2 flex flex-col gap-1"
          onSubmit={customerForm.handleSubmit(onCustomerSubmit)}
        >
          <FormField
            control={customerForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <Input
                      className="pr-5"
                      placeholder="이메일 입력"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    disabled={isSignInWithOtpPending}
                    type="button"
                    variant={"link"}
                    className="-transform-y-1/2 absolute top-0 right-0 h-full"
                    onClick={onSignInWithOtp}
                  >
                    인증요청
                  </Button>
                </div>
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
                onChange={
                  (e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)) // \D: 숫자가 아닌 문자, g: 전역
                }
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
          className="h-auto py-2.5 text-base cursor-pointer"
          type="submit"
        >
          로그인
        </Button>
      </Form>
    </TabsContent>
  );
}
