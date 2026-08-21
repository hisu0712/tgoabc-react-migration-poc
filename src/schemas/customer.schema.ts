import { z } from "zod";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { emailField, nameField } from "./common.schema";

dayjs.extend(customParseFormat);

// customer
export const customerSchema = z.object({
  name: nameField,
  email: emailField,
  birthDate: z
    .string()
    .min(1, "생년월일을 입력해주세요.")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식으로 입력해주세요.")
    .refine(
      (value) => dayjs(value, "YYYY-MM-DD", true).isValid(),
      "존재하지 않는 날짜예요.",
    )
    .refine(
      (value) => !dayjs(value).isAfter(dayjs(), "day"),
      "미래 날짜는 입력할 수 없어요.",
    ),
  gender: z.enum(["M", "F"], {
    error: "성별을 선택해주세요.",
  }),
  designerId: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
