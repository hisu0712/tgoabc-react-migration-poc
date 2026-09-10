import BottomButton from "@/components/layout/bottom-button";
import DeleteUserButton from "@/components/delete-user-button";
import ErrorRedirect from "@/components/error-redirect";
import HeaderNav from "@/components/layout/header-nav";
import { Form } from "@/components/ui/form";
import { useUpdateMember } from "@/hooks/mutations/member/use-update-member";
import { useMemberData } from "@/hooks/queries/member/use-member-data";
import { MEMBER_HOME_PATH } from "@/lib/route";
import { type MemberFormValues, memberSchema } from "@/schemas/member.schema";
import { useSession } from "@/store/session";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import MemberFormFields from "./components/member-form-fields";

export default function MemberInfoPage() {
  const session = useSession();

  const {
    data: member,
    isLoading: isFetchMemberLoading,
    isError: isFetchMemberError,
  } = useMemberData(session?.user.id);

  const { mutate: updateMember, isPending: isUpdateMemberPending } =
    useUpdateMember({
      onSuccess: () => {
        toast.success("정보가 수정되었습니다.", { position: "top-center" });
      },
      onError: () => {
        toast.error("정보 수정에 실패했습니다.", { position: "top-center" });
      },
    });

  const memberFormValues = useMemo(
    () =>
      member
        ? {
            name: member.name,
            phone: member.phone,
          }
        : undefined,
    [member],
  );

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    values: memberFormValues,
  });
  const {
    formState: { isDirty },
  } = form; // formState은 구독 안 된 속성은 아예 내부적으로 값 추적/계산 자체를 스킵

  const onSubmit = (values: MemberFormValues) => {
    if (!isDirty) {
      toast.info("변경된 내용이 없습니다.", { position: "top-center" });
      return;
    }
    updateMember({ memberId: session!.user.id, ...values });
  };

  if (isFetchMemberError) return <ErrorRedirect to={MEMBER_HOME_PATH} />;

  return (
    <>
      <HeaderNav title="계정 정보" />

      <Form {...form}>
        <form
          id="member-info-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-3"
        >
          <MemberFormFields
            member={member}
            isLoading={isFetchMemberLoading}
            disabled={isUpdateMemberPending}
          />
        </form>
      </Form>

      <DeleteUserButton />

      <BottomButton
        disabled={isUpdateMemberPending}
        form="member-info-form"
        type="submit"
      >
        수정
      </BottomButton>
    </>
  );
}
