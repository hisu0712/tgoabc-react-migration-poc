import GlobalLoader from "@/components/global-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateMember } from "@/hooks/mutations/member/use-update-member";
import { useMemberData } from "@/hooks/queries/use-member-info-data";
import { type MemberFormValues, memberSchema } from "@/schemas/member.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { Navigate, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function MemberInfoPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const {
    data: member,
    isLoading: isFetchMemberLoading,
    isError: isFetchMemberError,
  } = useMemberData(userId);

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

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    values: memberFormValues,
  });

  if (isFetchMemberLoading) return <GlobalLoader />;
  if (isFetchMemberError) return <Navigate to={"/"} />;
  if (!userId) return <Navigate to={"/"} />;

  const onSubmit = (values: MemberFormValues) => {
    if (!isDirty) {
      toast.info("변경된 내용이 없습니다.", { position: "top-center" });
      return;
    }
    updateMember({ userId, ...values });
  };
  const onInvalid = (errors: FieldErrors<MemberFormValues>) => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message, { position: "top-center" });
    }
  };

  const handleDeleteUser = () => {
    // 근데 여기서 user 을 삭제 해야함 그래야 member, shop 같이 삭제됨
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <ul>
          <li>
            <div>이름</div>
            <Input placeholder="이름 입력" {...register("name")} />
          </li>
          <li>
            <div>이메일</div>
            <Input readOnly value={member?.email} />
          </li>
          <li>
            <div>휴대전화</div>
            <Input
              placeholder="휴대전화 번호를 -없이 입력해주세요"
              {...register("phone")}
            />
          </li>
          <li>
            <div>비밀번호</div>
            {/* 비밀번호는 안불러오는데 그냥 ui 상 노출만 하려고 */}
            <Input readOnly type="password" value="111111" />
            {/* 여기서 기존 비밀번호 확인해야하는데, 그리고 홈으로 보내지 않고 이 페이지로 돌아오거나  */}
            <div onClick={() => navigate("/reset-password")}>변경하기</div>
          </li>
        </ul>

        <div>회원 탈퇴</div>

        <Button disabled={isUpdateMemberPending} type="submit">
          수정하기
        </Button>
      </form>
    </div>
  );
}
