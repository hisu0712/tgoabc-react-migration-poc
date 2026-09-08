import { Card } from "@/components/card";
import { PhoneInput } from "@/components/form/phone-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFindId } from "@/hooks/mutations/auth/use-find-id";
import { SIGN_IN_PATH } from "@/lib/route";
import { findIdSchema, type FindIdFormValues } from "@/schemas/auth.schema";
import { useOpenAlertModal } from "@/store/modals/alert-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function FindIdForm() {
  const openAlertModal = useOpenAlertModal();
  const navigate = useNavigate();
  
  const findIdForm = useForm<FindIdFormValues>({
    resolver: zodResolver(findIdSchema),
    defaultValues: { name: "", phone: "" },
  });

  const { mutate: findId, isPending: isFindIdPending } = useFindId({
    onSuccess: (data) =>
      openAlertModal({
        title: "아이디 찾기",
        description: `검색결과 아이디는 아래와 같습니다. ${data.email}`,
        onPositive: () => navigate(SIGN_IN_PATH),
      }),
    onError: async (error) => {
      if (error instanceof FunctionsHttpError) {
        const errorBody = await error.context.json();
        toast.error(errorBody.error, { position: "top-center" });
      } else {
        toast.error("알 수 없는 오류가 발생했습니다.", {
          position: "top-center",
        });
      }
      findIdForm.reset();
    },
  });

  const onFindIdSubmit = (values: FindIdFormValues) => {
    findId(values);
  };

  return (
    <Form {...findIdForm}>
      <Card className="mb-4">
        <form
          id="find-id-form"
          className="grid gap-2"
          onSubmit={findIdForm.handleSubmit(onFindIdSubmit)}
        >
          <FormField
            control={findIdForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>이름</FormLabel>
                <FormControl>
                  <Input
                    disabled={isFindIdPending}
                    placeholder="이름 입력"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={findIdForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>휴대전화</FormLabel>
                <FormControl>
                  <PhoneInput disabled={isFindIdPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Card>

      <Button
        disabled={isFindIdPending}
        form="find-id-form"
        type="submit"
        className="w-full cursor-pointer py-5"
      >
        아이디 찾기
      </Button>
    </Form>
  );
}
