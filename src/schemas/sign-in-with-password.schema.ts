import { z } from "zod";
import { emailField, passwordField } from "./common.schema";

export const signInWithPasswordSchema = z.object({
  email: emailField,
  password: passwordField,
});

export type SignInWithPasswordFormValues = z.infer<
  typeof signInWithPasswordSchema
>;
