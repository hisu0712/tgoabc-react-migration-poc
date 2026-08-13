import HeaderNav from "@/components/header-nav";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import BottomButton from "@/components/bottom-button";
import { useForm } from "react-hook-form";
import {
  type CustomerFormValues,
  customerSchema,
} from "@/schemas/customer.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import useCustomerData from "@/hooks/queries/use-customer-data";
import { Navigate, useNavigate, useParams } from "react-router";
import GlobalLoader from "@/components/global-loader";
import { useMemo } from "react";
import { toast } from "sonner";
import { useOpenAlertModal } from "@/store/alert";
import { useUpdateCustomer } from "@/hooks/mutations/customer/use-update-customer";
import { Input } from "@/components/ui/input";
import { formatBirthDateInput } from "@/lib/format";
import { GENDER_FORM_VALUES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FormHint from "@/components/form-hint";
import { Trash2 } from "lucide-react";
import { useUnlinkCustomer } from "@/hooks/mutations/customer/use-unlink-customer";
import { useSession } from "@/store/session";

export default function CustomerInfoPage() {
  const session = useSession();
  const { customerId } = useParams();
  const openAlertModal = useOpenAlertModal();
  const navigate = useNavigate();

  const {
    data: customer,
    isLoading: isFetchCustomerLoading,
    error: isFetchCustomerError,
  } = useCustomerData(customerId);

  const { mutate: updateCustomer, isPending: isUpdateCustomerPending } =
    useUpdateCustomer({
      onSuccess: () => {
        toast.success("정보가 수정되었습니다.", { position: "top-center" });
      },
      onError: () => {
        toast.error("정보 수정에 실패했습니다.", { position: "top-center" });
      },
    });

  const { mutate: unlinkCustomer } = useUnlinkCustomer({
    onSuccess: () => {
      toast.success("고객이 삭제되었습니다.", { position: "top-center" });
      navigate("/", { replace: true });
    },
    onError: () => {
      toast.error("고객 삭제에 실패했습니다.", { position: "top-center" });
    },
  });

  const customerFormValues = useMemo(
    () =>
      customer
        ? {
            name: customer.name,
            email: customer.email,
            birthDate: customer.birth_date,
            gender: customer.gender,
          }
        : undefined,
    [customer],
  );

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    values: customerFormValues,
  });
  const {
    formState: { isDirty },
  } = form;

  if (!customerId) return <Navigate to={"/"} />;
  if (isFetchCustomerLoading) return <GlobalLoader />;
  if (isFetchCustomerError) return <Navigate to={"/"} />;

  const onSubmit = (values: CustomerFormValues) => {
    if (!isDirty) {
      toast.info("변경된 내용이 없습니다.", { position: "top-center" });
      return;
    }

    updateCustomer({ customerId, ...values });
  };

  const handleDeleteCustomer = () => {
    openAlertModal({
      title: "고객 삭제",
      description: "고객을 삭제하시겠습니까? *삭제 후 되돌릴 수 없습니다.",
      onPositive: () => {
        unlinkCustomer({ memberId: session!.user.id, customerId });
      },
    });
  };

  return (
    <div>
      <HeaderNav
        title="고객 정보"
        rightSlot={
          <div
            onClick={handleDeleteCustomer}
            className="text-destructive flex flex-col items-center"
          >
            <Trash2 className="size-6" strokeWidth={1.5} />
            <span className="text-sm">삭제</span>
          </div>
        }
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="update-customer-form"
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
                    disabled={isUpdateCustomerPending}
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
                    disabled={isUpdateCustomerPending}
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
                    disabled={isUpdateCustomerPending}
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
                        disabled={isUpdateCustomerPending}
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
        disabled={isUpdateCustomerPending}
        form="update-customer-form"
      >
        저장
      </BottomButton>
    </div>
  );
}
