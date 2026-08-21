import { Card, DesignerListCard } from "@/components/card";
import HeaderNav from "@/components/header-nav";
import useDesignersData from "@/hooks/queries/use-designers-data";
import {
  useOpenCreateDesignerModal,
  useOpenEditDesignerModal,
} from "@/store/designer-editor-modal";
import { useSession } from "@/store/session";
import { Plus } from "lucide-react";
import Loader from "@/components/loader";
import EmptyContent from "@/components/emptyContent";

export default function DesignerPage() {
  const session = useSession();
  const openCreateDesignerModal = useOpenCreateDesignerModal();
  const openEditDesignerModal = useOpenEditDesignerModal();

  const { data, isLoading } = useDesignersData(session?.user.id);

  return (
    <div>
      <HeaderNav title="디자이너 목록" />

      <Card
        onClick={openCreateDesignerModal}
        variant={"gradient"}
        className="mb-6 flex items-center justify-between"
      >
        <span className="text-lg font-semibold">신규 디자이너 추가</span>
        <Plus className="size-9" strokeWidth={1.3} />
      </Card>

      <div className="bg-muted-foreground/20 mb-6 h-[1px] w-full"></div>

      <div className="flex flex-col gap-2">
        {isLoading ? (
          <Loader />
        ) : data?.length ? (
          data.map((designer) => (
            <DesignerListCard
              key={designer.id}
              name={designer.name}
              phone={designer.phone}
              onClick={() =>
                openEditDesignerModal({
                  designerId: designer.id,
                  name: designer.name,
                  phone: designer.phone,
                })
              }
            />
          ))
        ) : (
          <EmptyContent content="아직 등록된 디자이너가 없습니다." />
        )}
      </div>
    </div>
  );
}
