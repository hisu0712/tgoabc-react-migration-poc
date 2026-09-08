import { BUCKET_NAME } from "@/constants";
import { supabase } from "@/lib/supabase";

export async function uploadImage({
  file,
  filePath,
}: {
  file: File;
  filePath: string;
}) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = await supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteImagesInPath(path: string) {
  const { data: files, error: fetchFilesError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(path);

  if (!files || files.length === 0) return;

  if (fetchFilesError) throw fetchFilesError;

  const { error: removeError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(files.map((file) => `${path}/${file.name}`));

  if (removeError) throw removeError;
}

export async function moveImage(fromPath: string, toPath: string) {
  const { error: moveError } = await supabase.storage
    .from(BUCKET_NAME)
    .move(fromPath, toPath);

  if (moveError) throw moveError;

  const {
    data: { publicUrl },
  } = await supabase.storage.from(BUCKET_NAME).getPublicUrl(toPath);

  return publicUrl;
}
