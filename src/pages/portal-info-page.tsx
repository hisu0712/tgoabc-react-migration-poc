import HeaderNav from "@/components/header-nav";
import { Form } from "@/components/ui/form";
import BottomButton from "@/components/bottom-button";
import { useForm } from "react-hook-form";
import {
  type CustomerFormValues,
  customerSchema,
} from "@/schemas/customer.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import useCustomerData from "@/hooks/queries/use-customer-data";
import { Navigate, useNavigate } from "react-router";
import { useMemo } from "react";
import { toast } from "sonner";
import { useOpenAlertModal } from "@/store/alert";
import { useUpdateCustomer } from "@/hooks/mutations/customer/use-update-customer";
import { Trash2 } from "lucide-react";
import { useSession } from "@/store/session";
import CustomerFormFields from "@/components/customer-form-fields";
import useDesignersData from "@/hooks/queries/use-designers-data";
import Loader from "@/components/loader";

export function PortalInfoPage() {
  const session = useSession();
  const openAlertModal = useOpenAlertModal();
  const navigate = useNavigate();

  const { data: designers, isLoading: isFetchDesignersLoading } =
    useDesignersData(session!.user.id);

  const {
    data: customer,
    isLoading: isFetchCustomerLoading,
    error: isFetchCustomerError,
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

  // const { mutate: unlinkCustomer } = useUnlinkCustomer({
  //     onSuccess: () => {
  //       toast.success("고객이 삭제되었습니다.", { position: "top-center" });
  //       navigate("/", { replace: true });
  //     },
  //     onError: () => {
  //       toast.error("고객 삭제에 실패했습니다.", { position: "top-center" });
  //     },
  //   });

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

  //   if (!session?.user.id) return <Navigate to={"/"} />;
  //   if (isFetchCustomerError) return <Navigate to={"/"} />;

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

  const handleDeleteCustomer = () => {
    openAlertModal({
      title: "고객 삭제",
      description: "고객을 삭제하시겠습니까? *삭제 후 되돌릴 수 없습니다.",
      onPositive: () => {},
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
          {isFetchCustomerLoading || isFetchDesignersLoading ? (
            <Loader />
          ) : (
            <CustomerFormFields disabled={isUpdateCustomerPending} />
          )}
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
