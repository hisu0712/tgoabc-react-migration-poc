import { z } from "zod";
import { emailField, passwordField } from "./common.schema";

const phoneRegex = /^01[016789]\d{7,8}$/;

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요."),
  email: emailField,
  password: passwordField,
  phone: z
    .string()
    .trim()
    .min(1, "휴대전화 번호를 입력해주세요.")
    .regex(
      phoneRegex,
      "올바른 휴대전화 번호 형식이 아닙니다. (-없이 숫자만 입력)",
    ),
  shopName: z.string().trim().min(1, "매장명을 입력해주세요."),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
