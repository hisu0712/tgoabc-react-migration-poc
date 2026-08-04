import { z } from "zod";

const phoneRegex = /^01[016789]\d{7,8}$/;

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요."),
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
  password: z
    .string()
    .trim()
    .min(1, "비밀번호를 입력해주세요.")
    .min(6, "비밀번호는 6자 이상이어야 합니다."),
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
