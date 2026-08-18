import { Input } from "@/components/ui/input";
import { useCompleteMemberSignUp } from "@/hooks/mutations/auth/use-complete-member-sign-up";
import { generateErrorMessage } from "@/lib/error";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { signUpSchema, type SignUpFormValues } from "@/schemas/auth.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import BottomButton from "@/components/bottom-button";
import HeaderNav from "@/components/header-nav";
import { useState } from "react";
import { useSignInWithOtp } from "@/hooks/mutations/auth/use-sign-in-with-otp";
import { useVerifyOtp } from "@/hooks/mutations/auth/use-verify-otp";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerifyOtp, setIsVerifyOtp] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      shopName: "",
    },
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

  const { mutate: verifyOtp, isPending: isVerifyOtpPending } = useVerifyOtp({
    onSuccess: () => {
      setIsVerifyOtp(true);
      toast.success("인증이 완료되었습니다.", { position: "top-center" });
    },
    onError: (error) => {
      toast.error(generateErrorMessage(error), { position: "top-center" });
    },
  });

  const { mutate: completeMemberSignUp, isPending: isCompleteMemberSignUp } =
    useCompleteMemberSignUp({
      onSuccess: () => navigate("/sign-up/complete", { replace: true }),
      onError: (error) => {
        const message = generateErrorMessage(error);
        toast.error(message, {
          position: "top-center",
        });
      },
    });

  const onRequestOtp = async () => {
    const isEmailVaild = await form.trigger("email");
    if (!isEmailVaild) return;

    signInWithOtp({
      email: form.getValues("email"),
      shouldCreateUser: true,
    });
  };

  const onVerifyOtp = async () => {
    const isEmailVaild = await form.trigger("email");
    if (!isEmailVaild) return;

    verifyOtp({
      email: form.getValues("email"),
      token: otp,
    });
  };

  const onSubmit = (values: SignUpFormValues) => {
    if (!isOtpSent || !isVerifyOtp) {
      toast.error("이메일 인증을 완료해주세요.", { position: "top-center" });
      return;
    }

    completeMemberSignUp({
      name: values.name,
      phone: values.phone,
      shopName: values.shopName,
      password: values.password,
    });
  };

  return (
    <div>
      <HeaderNav title="회원가입" />

      <div className="mb-5 font-semibold">
        <p>회원님의</p>
        <p>필수 정보를 입력해 주세요</p>
      </div>

      <Form {...form}>
        <form
          id="sign-up-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-3"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input
                    disabled={isCompleteMemberSignUp}
                    placeholder="이름 입력"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      disabled={
                        isVerifyOtp ||
                        isSignInWithOtpPending ||
                        isCompleteMemberSignUp
                      }
                      placeholder="example@abc.com"
                      {...field}
                    />
                    <Button
                      disabled={
                        isSignInWithOtpPending || isCompleteMemberSignUp
                      }
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
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    inputMode="numeric"
                    maxLength={6}
                    disabled={isVerifyOtpPending || isCompleteMemberSignUp}
                    placeholder="인증번호 6자리 입력"
                  />
                  <Button
                    disabled={isVerifyOtpPending || isCompleteMemberSignUp}
                    type="button"
                    variant={"link"}
                    className="-transform-y-1/2 absolute top-0 right-0"
                    onClick={onVerifyOtp}
                  >
                    확인
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>휴대전화</FormLabel>
                <FormControl>
                  <Input
                    disabled={isCompleteMemberSignUp}
                    placeholder="휴대전화 번호를 -없이 입력해주세요"
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
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    disabled={isCompleteMemberSignUp}
                    placeholder="비밀번호 입력"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shopName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>매장명</FormLabel>
                <FormControl>
                  <Input
                    disabled={isCompleteMemberSignUp}
                    placeholder="매장명 입력"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <BottomButton
        disabled={isCompleteMemberSignUp}
        form="sign-up-form"
        type="submit"
      >
        다음
      </BottomButton>
    </div>
  );
}
