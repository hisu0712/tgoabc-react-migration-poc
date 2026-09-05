import { useSelectCustomerModal } from "@/store/select-customer-modal";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import SearchInput from "../search-input";
import { useState } from "react";
import useInfiniteCustomers from "@/hooks/queries/use-infinite-customers-data";
import { useSession } from "@/store/session";
import useLinkAnalysisToCustomer from "@/hooks/mutations/analysis/use-link-analysis-to-customer";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import Loader from "../loader";
import { CustomerCard } from "../card";
import { useCloseLinkCustomerModal } from "@/store/link-customer-modal";

export default function SelectCustomerModal() {
  const session = useSession();
  const navigate = useNavigate();
  const selectCustomerModal = useSelectCustomerModal();
  const closeLinkCustomerModal = useCloseLinkCustomerModal();

  const [searchKeyword, setSearchKeyword] = useState("");

  const { data: customers, isPending: isFetchCustomersPending } =
    useInfiniteCustomers({
      memberId: searchKeyword ? session!.user.id : undefined, // 검색으로만 고객 리스트 제공
      keyword: searchKeyword,
    });

  const {
    mutate: linkAnalysisToCustomer,
    isPending: isLinkAnalysisToCustomerPending,
  } = useLinkAnalysisToCustomer({
    onSuccess: () => {
      toast.success("분석 결과가 저장되었습니다.", { position: "top-center" });
    },
    onError: () => {
      toast.error("분석 결과 연결에 실패했습니다. 잠시 후 다시 시도해주세요.", {
        position: "top-center",
      });
    },
  });

  if (!selectCustomerModal.isOpen) return null;

  const handleSelectCustomer = (customerId: string) => {
    linkAnalysisToCustomer(
      {
        analysisId: selectCustomerModal.analysisId,
        memberId: session!.user.id,
        customerId,
      },
      {
        onSuccess: () => {
          navigate(`/customers/${customerId}`, { replace: true });
          selectCustomerModal.actions.close();
          closeLinkCustomerModal();
        },
      },
    );
  };

  return (
    <Dialog
      open={selectCustomerModal.isOpen}
      onOpenChange={selectCustomerModal.actions.close}
    >
      <DialogContent>
        <DialogTitle>기존 고객 선택</DialogTitle>

        <SearchInput
          onSearch={setSearchKeyword}
          placeholder="이름 또는 이메일"
        />

        <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
          {!searchKeyword ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              검색해서 고객을 찾아보세요
            </p>
          ) : isFetchCustomersPending ? (
            <Loader />
          ) : customers?.pages[0].length ? (
            customers.pages.map((page) =>
              page.map((c) => (
                <CustomerCard
                  key={c.id}
                  id={c.id}
                  name={c.name}
                  birthDate={c.birth_date}
                  variant={"compact"}
                  className="bg-background w-full shadow-none"
                  onClick={() => handleSelectCustomer(c.id)}
                  asButton
                  disabled={isLinkAnalysisToCustomerPending}
                />
              )),
            )
          ) : (
            <p className="text-muted-foreground py-8 text-center text-sm">
              검색 결과가 없습니다.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
