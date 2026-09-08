import BottomButton from "@/components/bottom-button";
import CustomerFormFields from "@/components/customer-form-fields";
import HeaderNav from "@/components/header-nav";
import { Form } from "@/components/ui/form";
import useLinkAnalysisToCustomer from "@/hooks/mutations/analysis/use-link-analysis-to-customer";
import { useCreateCustomer } from "@/hooks/mutations/customer/use-create-customer";
import useDesignersData from "@/hooks/queries/designer/use-designers-data";
import {
  customerSchema,
  type CustomerFormValues,
} from "@/schemas/customer.schema";
import { useSession } from "@/store/session";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

type LocationState = {
  analysisId: string;
};

export default function CustomerNewPage() {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: designers } = useDesignersData(session!.user.id);

  // 간편분석 후 신규 고객 추가
  const { analysisId } = (location.state ?? {}) as Partial<LocationState>;
  const { mutate: linkAnalysisToCustomer } = useLinkAnalysisToCustomer({
    onSuccess: () => {
      toast.success("분석 결과가 저장되었습니다.", { position: "top-center" });
    },
    onError: () => {
      toast.error("분석 결과 연결에 실패했습니다.", {
        position: "top-center",
      });
    },
  });

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      birthDate: "",
      gender: "M",
      designerId: "none",
    },
  });

  const { mutate: createCustomer, isPending: isCreateCustomerPending } =
    useCreateCustomer({
      onSuccess: (result) => {
        const { customerId, isAlreadyExists } = result!;

        toast.success(
          isAlreadyExists
            ? "이미 등록된 고객입니다."
            : "고객이 등록되었습니다.",
          { position: "top-center" },
        );

        if (analysisId) {
          linkAnalysisToCustomer({
            analysisId,
            memberId: session!.user.id,
            customerId: customerId,
          });
        }

        navigate(`/customers/${customerId}`, {
          replace: true,
        });
      },
      onError: (error) => {
        toast.error(error.message || "고객 등록에 실패했습니다.", {
          position: "top-center",
        });
      },
    });

  const onSubmit = (values: CustomerFormValues) => {
    createCustomer({
      memberId: session!.user.id,
      ...values,
      designerId:
        values.designerId === "none" ? null : Number(values.designerId),
    });
  };

  return (
    <div>
      <HeaderNav title="신규 고객 추가" />

      <div className="mb-5 text-lg font-semibold">
        <p>고객님의</p>
        <p>필수 정보를 입력해 주세요</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="create-customer-form"
          className="grid gap-3"
        >
          <CustomerFormFields
            disabled={isCreateCustomerPending}
            designers={designers}
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
