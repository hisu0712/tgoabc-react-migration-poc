import { z } from "zod";

export const nameField = z.string().trim().min(1, "이름을 입력해주세요.");

export const emailField = z
  .string()
  .trim()
  .min(1, "이메일을 입력해주세요.")
  .email("올바른 이메일 형식이 아닙니다.");

export const passwordField = z
  .string()
  .trim()
  .min(1, "비밀번호를 입력해주세요.")
  .min(6, "비밀번호는 6자 이상이어야 합니다.");

const phoneRegex = /^01[016789]\d{7,8}$/;
export const phoneField = z
  .string()
  .trim()
  .min(1, "휴대전화 번호를 입력해주세요.")
  .regex(
    phoneRegex,
    "올바른 휴대전화 번호 형식이 아닙니다. (-없이 숫자만 입력)",
  );

export const shopNameField = z.string().trim().min(1, "매장명을 입력해주세요.");

export const otpField = z
  .string()
  .trim()
  .length(6, "인증번호 6자리를 입력해주세요.");
