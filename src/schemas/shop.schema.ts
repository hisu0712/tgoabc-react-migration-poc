import { z } from "zod";
import { shopNameField } from "./common.schema";

// shop
const shopPhoneRegex = /^(0\d{7,10}|1\d{7})$/;

export const shopSchema = z.object({
  name: shopNameField,
  phone: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || shopPhoneRegex.test(value), {
      message: "올바른 전화번호 형식이 아닙니다.",
    }),
  address: z.string().trim().optional(),
  address_detail: z.string().trim().optional(),
});

export type ShopFormValues = z.infer<typeof shopSchema>;
