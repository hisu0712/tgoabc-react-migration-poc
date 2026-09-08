import { uploadImage } from "@/api/image";
import type { UseMutationCallback } from "@/types";
import { useMutation } from "@tanstack/react-query";

export function useUploadImage(callbacks?: UseMutationCallback<string>) {
  return useMutation({
    mutationFn: uploadImage,
    onSuccess: (imageUrl) => {
      if (callbacks?.onSuccess) callbacks.onSuccess(imageUrl);
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
