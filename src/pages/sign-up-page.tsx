import { Input } from "@/components/ui/input";
import { useCompleteMemberSignUp } from "@/hooks/mutations/auth/use-complete-member-sign-up";
import { generateErrorMessage } from "@/lib/error";
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
import BottomButton from "@/components/layout/bottom-button";
import HeaderNav from "@/components/layout/header-nav";
import { useState } from "react";
import { useSignInWithOtp } from "@/hooks/mutations/auth/use-sign-in-with-otp";
import { useVerifyOtp } from "@/hooks/mutations/auth/use-verify-otp";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/form/password-input";
import { useSetActiveRole } from "@/store/active-role";
import { PhoneInput } from "@/components/form/phone-input";
import { toastError, toastSuccess } from "@/lib/toast";

export default function SignUpPage() {
  const navigate = useNavigate();
  const setActiveRole = useSetActiveRole();

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
        toastSuccess("인증번호를 발송했습니다.");
      },
      onError: (error) => {
        toastError(generateErrorMessage(error));
      },
    });

  const { mutate: verifyOtp, isPending: isVerifyOtpPending } = useVerifyOtp({
    onSuccess: () => {
      setIsVerifyOtp(true);
      toastSuccess("인증이 완료되었습니다.");
    },
    onError: (error) => {
      toastError(generateErrorMessage(error));
    },
  });

  const { mutate: memberSignUp, isPending: isMemberSignUpPending } =
    useCompleteMemberSignUp({
      onSuccess: () => {
        setActiveRole("member");
        navigate("/sign-up/complete", { replace: true });
      },
      onError: (error) => {
        const message = generateErrorMessage(error);
        toastError(message);
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
    if (!isVerifyOtp) {
      toastError("이메일 인증을 완료해주세요.");
      return;
    }

    memberSignUp({
      name: values.name,
      phone: values.phone,
      shopName: values.shopName,
      password: values.password,
    });
  };

  return (
    <>
      <HeaderNav title="회원가입" />

      <div className="mb-5 text-lg font-semibold">
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
                <FormLabel required>이름</FormLabel>
                <FormControl>
                  <Input
                    disabled={isMemberSignUpPending}
                    placeholder="이름 입력"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-1">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>이메일</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        disabled={
                          isVerifyOtp ||
                          isSignInWithOtpPending ||
                          isMemberSignUpPending
                        }
                        placeholder="example@abc.com"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      disabled={isSignInWithOtpPending || isMemberSignUpPending}
                      type="button"
                      variant={"link"}
                      className="-transform-y-1/2 absolute top-0 right-0 h-full"
                      onClick={onRequestOtp}
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
              <div className="relative">
                <FormControl>
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    inputMode="numeric"
                    maxLength={6}
                    disabled={isVerifyOtpPending || isMemberSignUpPending}
                    placeholder="인증번호 6자리 입력"
                  />
                </FormControl>
                <Button
                  disabled={isVerifyOtpPending || isMemberSignUpPending}
                  type="button"
                  variant={"link"}
                  className="-transform-y-1/2 absolute top-0 right-0"
                  onClick={onVerifyOtp}
                >
                  확인
                </Button>
              </div>
              <FormMessage />
            </FormItem>
            {/* )} */}
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>휴대전화</FormLabel>
                <FormControl>
                  <PhoneInput disabled={isMemberSignUpPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-1">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>비밀번호</FormLabel>
                  <FormControl>
                    <PasswordInput
                      disabled={isMemberSignUpPending}
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
              name="repassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      disabled={isMemberSignUpPending}
                      placeholder="비밀번호 재입력"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="shopName"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>매장명</FormLabel>
                <FormControl>
                  <Input
                    disabled={isMemberSignUpPending}
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
        disabled={isMemberSignUpPending}
        form="sign-up-form"
        type="submit"
        loading={isMemberSignUpPending}
      >
        다음
      </BottomButton>
    </>
  );
}
