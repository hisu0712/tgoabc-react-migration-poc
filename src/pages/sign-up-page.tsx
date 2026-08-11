import { Input } from "@/components/ui/input";
import { useSignUp } from "@/hooks/mutations/auth/use-sign-up";
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

export default function SignUpPage() {
  const navigate = useNavigate();
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

  const { mutate: signUp, isPending: isSignUpPending } = useSignUp({
    onSuccess: () => navigate("/sign-up/complete", { replace: true }),
    onError: (error) => {
      const message = generateErrorMessage(error);
      toast.error(message, {
        position: "top-center",
      });
    },
  });

  const onSubmit = (values: SignUpFormValues) => {
    signUp(values);
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
                    disabled={isSignUpPending}
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
                  <Input
                    disabled={isSignUpPending}
                    placeholder="example@abc.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>휴대전화</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSignUpPending}
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
                    disabled={isSignUpPending}
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
                    disabled={isSignUpPending}
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
        disabled={isSignUpPending}
        form="sign-up-form"
        type="submit"
      >
        다음
      </BottomButton>
    </div>
  );
}
