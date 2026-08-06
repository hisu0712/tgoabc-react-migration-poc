import { updateMember } from "@/api/member";
import { QUERY_KEYS } from "@/lib/constants";
import type { MemberEntity, UseMutationCallback } from "@/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateMember(callbacks?: UseMutationCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMember,
    onSuccess: (updatedMember) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();

      queryClient.setQueryData<MemberEntity>(
        QUERY_KEYS.member.byId(updatedMember.id),
        updatedMember,
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
