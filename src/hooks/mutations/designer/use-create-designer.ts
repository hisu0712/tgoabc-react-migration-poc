import { createDesigner } from "@/api/designer";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useSession } from "@/store/session";
import type { DesignerEntity, UseMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateDesigner(callbacks?: UseMutationCallback) {
  const queryClient = useQueryClient();
  const session = useSession();

  return useMutation({
    mutationFn: createDesigner,
    onSuccess: (newDesigner) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();

      queryClient.setQueryData<DesignerEntity[]>(
        QUERY_KEYS.designer.memberList(session!.user.id),
        (designers) => {
          if (!designers)
            throw new Error(
              "디자이너 목록이 캐시 데이터에 보관되어있지 않습니다",
            );

          return [newDesigner, ...designers];
        },
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
