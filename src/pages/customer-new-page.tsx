import BottomButton from "@/components/bottom-button";
import FormHint from "@/components/form-hint";
import HeaderNav from "@/components/header-nav";
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
import { useCreateCustomer } from "@/hooks/mutations/customer/use-create-customer";
import { GENDER_FORM_VALUES } from "@/lib/constants";
import { formatBirthDateInput } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  customerSchema,
  type CustomerFormValues,
} from "@/schemas/customer.schema";
import { useSession } from "@/store/session";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function CustomerNewPage() {
  const session = useSession();
  const navigate = useNavigate();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      birthDate: "",
      gender: "M",
    },
  });

  const { mutate: createCustomer, isPending: isCreateCustomerPending } =
    useCreateCustomer({
      onSuccess: (createdCustomerId) => {
        toast.success("고객이 등록되었습니다.", { position: "top-center" });
        navigate(`/customers/${createdCustomerId}`);
      },
      onError: (error) => {
        toast.error(error.message || "고객 등록에 실패했습니다.", {
          position: "top-center",
        });
      },
    });

  const onSubmit = (values: CustomerFormValues) => {
    createCustomer({ memberId: session!.user.id, ...values });
  };

  return (
    <div>
      <HeaderNav title="신규 고객 추가" />

      <div className="mb-5 font-semibold">
        <p>고객님의</p>
        <p>필수 정보를 입력해 주세요</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="create-customer-form"
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
                    disabled={isCreateCustomerPending}
                    placeholder="이름을 입력해주세요."
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
                <FormHint>
                  고객 정보 식별을 위해 이메일을 정확히 입력해주세요.
                </FormHint>
                <FormControl>
                  <Input
                    disabled={isCreateCustomerPending}
                    placeholder="abc@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>생년월일</FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    maxLength={10}
                    disabled={isCreateCustomerPending}
                    placeholder="YYYY-MM-DD"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(formatBirthDateInput(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>성별</FormLabel>
                <FormControl>
                  <div role="radiogroup" className="grid grid-cols-2 gap-2">
                    {GENDER_FORM_VALUES.map((option) => (
                      <Button
                        disabled={isCreateCustomerPending}
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={field.value === option.value}
                        onClick={() => field.onChange(option.value)}
                        variant={"outline"}
                        className={cn(
                          field.value === option.value &&
                            "border-primary text-primary bg-primary/10",
                        )}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <BottomButton
        disabled={isCreateCustomerPending}
        form="create-customer-form"
      >
        저장
      </BottomButton>
    </div>
  );
}
