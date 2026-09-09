import { useDesignerEditorModal } from "@/store/modals/designer-editor-modal";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useOpenAlertModal } from "@/store/modals/alert-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type DesignerFormValues,
  designerSchema,
} from "@/schemas/designer.schema";
import FormHint from "../form/form-hint";
import { useCreateDesigner } from "@/hooks/mutations/designer/use-create-designer";
import { useSession } from "@/store/session";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { isPostgrestError } from "@/lib/error";
import { useUpdateDesigner } from "@/hooks/mutations/designer/use-update-designer";
import { useDeleteDesigner } from "@/hooks/mutations/designer/use-delete-designer";
import { PhoneInput } from "../form/phone-input";

export default function DesignerEditorModal() {
  const session = useSession();
  const designerEditorModal = useDesignerEditorModal();
  const openAlertModal = useOpenAlertModal();

  const [isEditMode, setIsEditMode] = useState(false);

  const { mutate: createDesigner, isPending: isCreateDesignerPending } =
    useCreateDesigner({
      onSuccess: () => {
        toast.success("디자이너가 등록되었습니다.", {
          position: "top-center",
        });
        designerEditorModal.actions.close();
      },
      onError: (error) => {
        if (isPostgrestError(error) && error.code === "23505") {
          toast.error("이미 등록된 전화번호입니다.", {
            position: "top-center",
          });
          return;
        }
        toast.error("문제가 발생했습니다. 잠시 후 다시 시도해주세요.", {
          position: "top-center",
        });
      },
    });

  const { mutate: updateDesigner, isPending: isUpdateDesignerPending } =
    useUpdateDesigner({
      onSuccess: () => {
        toast.success("디자이너 정보가 수정되었습니다.", {
          position: "top-center",
        });
        designerEditorModal.actions.close();
      },
      onError: (error) => {
        if (isPostgrestError(error) && error.code === "23505") {
          toast.error("이미 등록된 전화번호입니다.", {
            position: "top-center",
          });
          return;
        }
        toast.error("문제가 발생했습니다. 잠시 후 다시 시도해주세요.", {
          position: "top-center",
        });
      },
    });

  const { mutate: deleteDesigner, isPending: isDeleteDesignerPending } =
    // 배정된 고객이 있을 때 alert으로 한번 더 확인할지 고민
    useDeleteDesigner({
      onSuccess: () => {
        toast.success("디자이너가 삭제되었습니다.", {
          position: "top-center",
        });
        designerEditorModal.actions.close();
      },
      onError: () => {
        toast.error("문제가 발생했습니다. 잠시 후 다시 시도해주세요.", {
          position: "top-center",
        });
      },
    });

  const form = useForm<DesignerFormValues>({
    resolver: zodResolver(designerSchema),
    defaultValues: { name: "", phone: "" },
  });

  const {
    formState: { isDirty },
  } = form;

  useEffect(() => {
    if (!designerEditorModal.isOpen) return;

    if (designerEditorModal.type === "EDIT") {
      setIsEditMode(true);
      form.reset({
        name: designerEditorModal.name,
        phone: designerEditorModal.phone,
      });
    } else {
      setIsEditMode(false);
      form.reset({ name: "", phone: "" });
    }
  }, [designerEditorModal.isOpen]);

  const onSubmit = (values: DesignerFormValues) => {
    if (!designerEditorModal.isOpen) return;

    if (designerEditorModal.type === "CREATE") {
      createDesigner({ memberId: session!.user.id, ...values });
    } else if (designerEditorModal.type === "EDIT") {
      if (!isDirty) {
        toast.info("변경된 내용이 없습니다.", { position: "top-center" });
        return;
      }
      updateDesigner({ designerId: designerEditorModal.designerId, ...values });
    }
  };

  const handleCloseModal = () => {
    if (isDirty) {
      openAlertModal({
        title: "작성이 마무리 되지 않았습니다",
        description: "이 화면에서 나가면 작성중이던 내용이 사라집니다.",
        onPositive: () => {
          designerEditorModal.actions.close();
        },
      });
      return;
    }

    designerEditorModal.actions.close();
  };

  const handleDeleteDesigner = () => {
    if (!designerEditorModal.isOpen || designerEditorModal.type !== "EDIT")
      return;

    openAlertModal({
      title: "디자이너 삭제",
      description: "디자이너를 삭제하시겠습니까? *삭제 후 되돌릴 수 없습니다.",
      onPositive: () => deleteDesigner(designerEditorModal.designerId),
    });
  };

  return (
    <Dialog open={designerEditorModal.isOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogTitle>
          {isEditMode ? "디자이너 수정" : "디자이너 추가"}
        </DialogTitle>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="designer-editor-form"
            className="grid gap-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input placeholder="이름을 입력해주세요." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>휴대전화</FormLabel>
                  <FormControl>
                    <PhoneInput {...field} />
                  </FormControl>
                  <FormHint>
                    디자이너 식별을 위해 휴대전화 번호를 정확히 입력해 주세요.
                  </FormHint>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="flex gap-2">
          {isEditMode && (
            <Button
              disabled={isDeleteDesignerPending}
              onClick={handleDeleteDesigner}
              type="button"
              className="flex-1"
              variant={"secondary"}
            >
              삭제
            </Button>
          )}
          <Button
            disabled={isCreateDesignerPending || isUpdateDesignerPending}
            type="submit"
            form="designer-editor-form"
            className="flex-1"
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
