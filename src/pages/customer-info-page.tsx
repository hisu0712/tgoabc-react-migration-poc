import HeaderNav from "@/components/layout/header-nav";
import { Form } from "@/components/ui/form";
import BottomButton from "@/components/layout/bottom-button";
import { useForm } from "react-hook-form";
import {
  type CustomerFormValues,
  customerSchema,
} from "@/schemas/customer.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import { useMemo } from "react";
import { useOpenAlertModal } from "@/store/modals/alert-modal";
import { useUnlinkCustomer } from "@/hooks/mutations/customer/use-unlink-customer";
import { useSession } from "@/store/session";
import CustomerFormFields from "@/components/fields/customer-form-fields";
import useDesignersData from "@/hooks/queries/designer/use-designers-data";
import useCustomerWithDesignerData from "@/hooks/queries/customer/use-customer-with-designer-data";
import { useUpdateCustomerWithDesigner } from "@/hooks/mutations/customer/use-update-customer-with-designer";
import { Button } from "@/components/ui/button";
import { MEMBER_HOME_PATH } from "@/lib/route";
import ErrorRedirect from "@/components/error-redirect";
import { toastError, toastNoChange, toastSuccess } from "@/lib/toast";
import useCustomerConfirmedAt from "@/hooks/queries/customer/use-customer-confirmed-at";
import { isPostgrestError } from "@/lib/error";
import { useOpenEmailConflictModal } from "@/store/modals/email-conflict-modal";

export default function CustomerInfoPage() {
  const session = useSession();
  const { customerId } = useParams();
  const openAlertModal = useOpenAlertModal();
  const openEmailConflictModal = useOpenEmailConflictModal();
  const navigate = useNavigate();

  const { data: designers, isLoading: isFetchDesignersLoading } =
    useDesignersData(session!.user.id);

  const {
    data: customer,
    isLoading: isFetchCustomerLoading,
    isError: isFetchCustomerError,
  } = useCustomerWithDesignerData({ customerId, memberId: session!.user.id });

  const { data: confirmedAt, isLoading: isFetchConfirmedAtLoading } =
    useCustomerConfirmedAt(customerId);

  const { mutate: updateCustomer, isPending: isUpdateCustomerPending } =
    useUpdateCustomerWithDesigner({
      onSuccess: () => {
        toastSuccess("정보가 수정되었습니다.");
      },
      onError: (error) => {
        if (isPostgrestError(error) && error.code === "23505") {
          openEmailConflictModal({
            customerId: customerId!,
            newEmail: form.getValues("email"),
          });
          return;
        }
        toastError("정보 수정에 실패했습니다.");
      },
    });

  const { mutate: unlinkCustomer, isPending: isUnlinkCustomerPending } =
    useUnlinkCustomer({
      onSuccess: () => {
        toastSuccess("고객이 삭제되었습니다.");
        navigate(MEMBER_HOME_PATH, { replace: true });
      },
      onError: () => {
        toastError("고객 삭제에 실패했습니다.");
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
            designerId:
              customer.designer_id !== null
                ? String(customer.designer_id)
                : "none",
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

  if (!customerId) return <ErrorRedirect to={MEMBER_HOME_PATH} />;
  if (isFetchCustomerError) return <ErrorRedirect to={MEMBER_HOME_PATH} />;

  const onSubmit = (values: CustomerFormValues) => {
    if (!isDirty) {
      toastNoChange();
      return;
    }

    updateCustomer({
      memberId: session!.user.id,
      customerId,
      ...values,
      designerId:
        values.designerId === "none" ? null : Number(values.designerId),
    });
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

  const isLoading =
    isFetchCustomerLoading ||
    isFetchDesignersLoading ||
    isFetchConfirmedAtLoading;
  const isFormDisabled = isUpdateCustomerPending || isUnlinkCustomerPending;
  const isEmailConfirmed = !!confirmedAt;

  return (
    <>
      <HeaderNav title="고객 정보" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="update-customer-form"
          className="grid gap-3"
        >
          <CustomerFormFields
            isLoading={isLoading}
            disabled={isFormDisabled}
            designers={designers}
            designerId={customer?.designer_id ?? undefined}
            emailReadOnly={isEmailConfirmed}
          />
        </form>
      </Form>

      <div className="mt-5 flex items-center justify-center">
        <Button
          disabled={isFormDisabled}
          type="button"
          onClick={handleDeleteCustomer}
          variant={"link"}
          className="text-muted-foreground cursor-pointer"
        >
          고객 삭제
        </Button>
      </div>

      <BottomButton loading={isFormDisabled} form="update-customer-form">
        저장
      </BottomButton>
    </>
  );
}
