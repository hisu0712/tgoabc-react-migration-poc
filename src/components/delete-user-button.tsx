import { useDeleteUser } from "@/hooks/mutations/auth/use-delete-user";
import { useOpenAlertModal } from "@/store/modals/alert-modal";
import { useSetSession } from "@/store/session";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { SIGN_IN_PATH } from "@/lib/route";
import { toastError, toastSuccess } from "@/lib/toast";

export default function DeleteUserButton() {
  const openAlertModal = useOpenAlertModal();
  const setSession = useSetSession();
  const navigate = useNavigate();

  const { mutate: deleteUser, isPending: isDeleteUserPending } = useDeleteUser({
    onSuccess: () => {
      setSession(null); // Auth.users가 없는 상태이기 때문에 signOut 불가
      toastSuccess("회원 탈퇴가 완료되었습니다.");
      navigate(SIGN_IN_PATH, { replace: true });
    },
    onError: () => {
      toastError("회원 탈퇴 중 오류가 발생했습니다.");
    },
  });

  const handleDeleteMember = () => {
    openAlertModal({
      title: "계정 탈퇴",
      description:
        "앱에 저장된 모든 데이터가 영구적으로 삭제됩니다. 계정을 정말 삭제하시겠어요?",
      onPositive: () => {
        deleteUser();
      },
    });
  };

  return (
    <div className="mt-5 flex items-center justify-center">
      <Button
        disabled={isDeleteUserPending}
        type="button"
        onClick={handleDeleteMember}
        variant={"link"}
        className="text-muted-foreground cursor-pointer"
      >
        계정 탈퇴
      </Button>
    </div>
  );
}
