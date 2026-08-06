import { email, z } from "zod";
import {
  emailField,
  nameField,
  passwordField,
  phoneField,
} from "./common.schema";

// sign-up
export const signUpSchema = z.object({
  name: nameField,
  email: emailField,
  password: passwordField,
  phone: phoneField,
  shopName: z.string().trim().min(1, "매장명을 입력해주세요."),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

// sign-in-with-password
export const signInWithPasswordSchema = z.object({
  email: emailField,
  password: passwordField,
});

export type SignInWithPasswordFormValues = z.infer<
  typeof signInWithPasswordSchema
>;

// find-id
export const findIdSchema = z.object({
  name: nameField,
  phone: phoneField,
});

export type FindIdFormValues = z.infer<typeof findIdSchema>;

// find-password
export const findPasswordSchema = z.object({
  email: emailField,
});

export type FindPasswordFormValues = z.infer<typeof findPasswordSchema>;

// reset-password
export const resetPasswordSchema = z
  .object({
    password: passwordField,
    repassword: passwordField,
  })
  .refine((data) => data.password === data.repassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["repassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
