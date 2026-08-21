import { z } from "zod";
import { nameField, phoneField } from "./common.schema";

export const designerSchema = z.object({
  name: nameField,
  phone: phoneField,
});

export type DesignerFormValues = z.infer<typeof designerSchema>;
