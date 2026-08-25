import { z } from "zod";
import {
  emailField,
  nameField,
  otpField,
  passwordField,
  phoneField,
  shopNameField,
} from "./common.schema";

// sign-up
export const signUpSchema = z
  .object({
    name: nameField,
    email: emailField,
    password: passwordField,
    repassword: passwordField,
    phone: phoneField,
    shopName: shopNameField,
  })
  .refine((data) => data.password === data.repassword, {
    message: "비밀번호와 일치하지 않습니다.",
    path: ["repassword"],
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
    message: "신규 비밀번호와 일치하지 않습니다.",
    path: ["repassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// customer-sign-in
export const customerSignInSchema = z.object({
  email: emailField,
});

export type CustomerSignInFormValues = z.infer<typeof customerSignInSchema>;
