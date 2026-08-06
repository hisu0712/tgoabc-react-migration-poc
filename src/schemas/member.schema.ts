import { z } from "zod";
import { nameField, phoneField, shopNameField } from "./common.schema";

// member
export const memberSchema = z.object({
  name: nameField,
  phone: phoneField,
});

export type MemberFormValues = z.infer<typeof memberSchema>;
