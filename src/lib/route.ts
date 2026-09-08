import type { UserType } from "@/types";

export const SIGN_IN_PATH = "/sign-in";
export const MEMBER_HOME_PATH = "/";
export const CUSTOMER_HOME_PATH = "/portal";

export const roleHomePath = (role: UserType) =>
  role === "member" ? MEMBER_HOME_PATH : CUSTOMER_HOME_PATH;
