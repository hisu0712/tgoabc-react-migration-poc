import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@/hooks/mutations/auth/use-sign-up";
import { generateErrorMessage } from "@/lib/error";
import { toast } from "sonner";
import { useForm, type FieldErrors } from "react-hook-form";
import { signUpSchema, type SignUpFormValues } from "@/schemas/sign-up";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const { mutate: signUp, isPending: isSignUpPending } = useSignUp({
    onSuccess: () => navigate("/sign-up/complete"),
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

  const onInvalid = (errors: FieldErrors<SignUpFormValues>) => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message, { position: "top-center" });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <ul className="flex flex-col gap-3">
          <li>
            <div>이름</div>
            <Input
              disabled={isSignUpPending}
              placeholder="이름 입력"
              {...register("name")}
            />
          </li>
          <li>
            <div>이메일</div>
            <Input
              disabled={isSignUpPending}
              placeholder="example@abc.com"
              {...register("email")}
            />
          </li>
          <li>
            <div>비밀번호</div>
            <Input
              disabled={isSignUpPending}
              type="password"
              placeholder="비밀번호 입력"
              {...register("password")}
            />
          </li>
          <li>
            <div>휴대전화</div>
            <Input
              disabled={isSignUpPending}
              placeholder="휴대전화 번호를 -없이 입력해주세요"
              {...register("phone")}
            />
          </li>
          <li>
            <div>매장명</div>
            <Input
              disabled={isSignUpPending}
              placeholder="매장명 입력"
              {...register("shopName")}
            />
          </li>
        </ul>

        <Button disabled={isSignUpPending} type="submit">
          다음
        </Button>
      </form>
    </div>
  );
}
