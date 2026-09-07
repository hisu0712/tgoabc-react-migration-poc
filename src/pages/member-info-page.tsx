import BottomButton from "@/components/bottom-button";
import DeleteUserButton from "@/components/delete-user-button";
import ErrorRedirect from "@/components/error-redirect";
import GlobalLoader from "@/components/global-loader";
import HeaderNav from "@/components/header-nav";
import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateMember } from "@/hooks/mutations/member/use-update-member";
import { useMemberData } from "@/hooks/queries/use-member-data";
import { MEMBER_HOME_PATH } from "@/lib/route";
import { type MemberFormValues, memberSchema } from "@/schemas/member.schema";
import { useSession } from "@/store/session";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const MASKED_PASSWORD = "••••••••";

export default function MemberInfoPage() {
  const session = useSession();
  const navigate = useNavigate();

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

  if (isFetchMemberLoading) return <GlobalLoader />;
  if (isFetchMemberError) return <ErrorRedirect to={MEMBER_HOME_PATH} />;

  const onSubmit = (values: MemberFormValues) => {
    if (!isDirty) {
      toast.info("변경된 내용이 없습니다.", { position: "top-center" });
      return;
    }
    updateMember({ memberId: session!.user.id, ...values });
  };

  return (
    <div>
      <HeaderNav title="계정 정보" />

      <Form {...form}>
        <form
          id="member-info-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-3"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>이름</FormLabel>
                <FormControl>
                  <Input
                    disabled={isUpdateMemberPending}
                    placeholder="이름 입력"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-1">
            <Label>이메일</Label>
            <Input readOnly value={member?.email} />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>휴대전화</FormLabel>
                <FormControl>
                  <PhoneInput disabled={isUpdateMemberPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-1">
            <Label>비밀번호</Label>
            <div className="relative">
              <Input readOnly type="password" value={MASKED_PASSWORD} />
              <Button
                disabled={isUpdateMemberPending}
                type="button"
                variant={"link"}
                className="absolute top-1/2 right-0 h-full -translate-y-1/2 cursor-pointer"
                onClick={() => navigate("/reset-password")}
              >
                변경하기
              </Button>
            </div>
          </div>
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
    </div>
  );
}
