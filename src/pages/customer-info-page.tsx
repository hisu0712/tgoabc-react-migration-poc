import HeaderNav from "@/components/header-nav";
import { Form } from "@/components/ui/form";
import BottomButton from "@/components/bottom-button";
import { useForm } from "react-hook-form";
import {
  type CustomerFormValues,
  customerSchema,
} from "@/schemas/customer.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useNavigate, useParams } from "react-router";
import { useMemo } from "react";
import { toast } from "sonner";
import { useOpenAlertModal } from "@/store/alert";
import { useUnlinkCustomer } from "@/hooks/mutations/customer/use-unlink-customer";
import { useSession } from "@/store/session";
import CustomerFormFields from "@/components/customer-form-fields";
import useDesignersData from "@/hooks/queries/use-designers-data";
import Loader from "@/components/loader";
import useCustomerWithDesignerData from "@/hooks/queries/use-customer-with-designer-data";
import { useUpdateCustomerWithDesigner } from "@/hooks/mutations/customer/use-update-customer-with-designer";
import { Button } from "@/components/ui/button";

export default function CustomerInfoPage() {
  const session = useSession();
  const { customerId } = useParams();
  const openAlertModal = useOpenAlertModal();
  const navigate = useNavigate();

  const { data: designers, isLoading: isFetchDesignersLoading } =
    useDesignersData(session!.user.id);

  const {
    data: customer,
    isLoading: isFetchCustomerLoading,
    error: isFetchCustomerError,
  } = useCustomerWithDesignerData({ customerId, memberId: session!.user.id });

  const { mutate: updateCustomer, isPending: isUpdateCustomerPending } =
    useUpdateCustomerWithDesigner({
      onSuccess: () => {
        toast.success("정보가 수정되었습니다.", { position: "top-center" });
      },
      onError: () => {
        toast.error("정보 수정에 실패했습니다.", { position: "top-center" });
      },
    });

  const { mutate: unlinkCustomer, isPending: isUnlinkCustomerPending } =
    useUnlinkCustomer({
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

  if (!customerId) return <Navigate to={"/"} />;
  if (isFetchCustomerError) return <Navigate to={"/"} />;

  const onSubmit = (values: CustomerFormValues) => {
    if (!isDirty) {
      toast.info("변경된 내용이 없습니다.", { position: "top-center" });
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

  return (
    <div>
      <HeaderNav title="고객 정보" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="update-customer-form"
          className="grid gap-3"
        >
          {isFetchCustomerLoading || isFetchDesignersLoading ? (
            <Loader />
          ) : (
            <CustomerFormFields
              disabled={isUpdateCustomerPending}
              designers={designers}
            />
          )}
        </form>
      </Form>

      <div className="mt-5 flex items-center justify-center">
        <Button
          disabled={isUnlinkCustomerPending}
          type="button"
          onClick={handleDeleteCustomer}
          variant={"link"}
          className="text-muted-foreground cursor-pointer"
        >
          고객 삭제
        </Button>
      </div>

      <BottomButton
        loading={isUpdateCustomerPending}
        form="update-customer-form"
      >
        저장
      </BottomButton>
    </div>
  );
}
