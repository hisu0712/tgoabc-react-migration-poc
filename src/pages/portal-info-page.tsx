import HeaderNav from "@/components/layout/header-nav";
import { Form } from "@/components/ui/form";
import BottomButton from "@/components/layout/bottom-button";
import { useForm } from "react-hook-form";
import {
  type CustomerFormValues,
  customerSchema,
} from "@/schemas/customer.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import useCustomerData from "@/hooks/queries/customer/use-customer-data";
import { useMemo } from "react";
import { toast } from "sonner";
import { useUpdateCustomer } from "@/hooks/mutations/customer/use-update-customer";
import { useSession } from "@/store/session";
import CustomerFormFields from "@/components/customer-form-fields";
import DeleteUserButton from "@/components/delete-user-button";
import { CUSTOMER_HOME_PATH } from "@/lib/route";
import ErrorRedirect from "@/components/error-redirect";

export function PortalInfoPage() {
  const session = useSession();

  const {
    data: customer,
    isLoading: isFetchCustomerLoading,
    isError: isFetchCustomerError,
  } = useCustomerData(session!.user.id);

  const { mutate: updateCustomer, isPending: isUpdateCustomerPending } =
    useUpdateCustomer({
      onSuccess: () => {
        toast.success("정보가 수정되었습니다.", { position: "top-center" });
      },
      onError: () => {
        toast.error("정보 수정에 실패했습니다.", { position: "top-center" });
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

  if (isFetchCustomerError) return <ErrorRedirect to={CUSTOMER_HOME_PATH} />;

  const onSubmit = (values: CustomerFormValues) => {
    if (!isDirty) {
      toast.info("변경된 내용이 없습니다.", { position: "top-center" });
      return;
    }

    updateCustomer({
      customerId: session!.user.id,
      ...values,
    });
  };

  return (
    <>
      <HeaderNav title="계정 정보" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="update-customer-form"
          className="grid gap-3"
        >
          <CustomerFormFields
            isLoading={isFetchCustomerLoading}
            disabled={isUpdateCustomerPending}
            emailReadOnly={true}
            hasDesignerField={false}
          />
        </form>
      </Form>

      <DeleteUserButton />

      <BottomButton
        disabled={isUpdateCustomerPending}
        form="update-customer-form"
      >
        저장
      </BottomButton>
    </>
  );
}
