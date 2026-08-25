import HeaderHomeNav from "@/components/header-home-nav";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState } from "react";
import loginMemberImage from "@/assets/login_member.svg";
import loginCustomerImage from "@/assets/login_customer.svg";
import logoBlue from "@/assets/logo_blue.png";
import logoWhite from "@/assets/logo_white.png";
import SignInMemberForm from "./sign-in-member-form";
import SignInCustomerForm from "./sign-in-customer-form";

export default function SignInPage() {
  const [authType, setAuthType] = useState<"member" | "customer">("member");

  return (
    <div className="flex min-h-[100vh] flex-col">
      <div
        className={cn(
          "pr-7 pl-7",
          authType === "member" ? "bg-primary" : "bg-primary/20",
        )}
      >
        <HeaderHomeNav
          className={cn(
            "static bg-transparent backdrop-blur-none",
            authType === "member" ? "text-white" : "text-primary",
          )}
          logoSrc={authType === "member" ? logoWhite : logoBlue}
        />
        <div className="relative py-10">
          <p
            className={cn(
              "flex flex-col text-2xl",
              authType === "member"
                ? "font-semibold text-white"
                : "text-primary font-bold",
            )}
          >
            <span>{authType === "member" ? "매장" : "고객"}으로</span>
            <span>로그인하기</span>
          </p>
          <div className="absolute right-0 bottom-4.5 aspect-[1.1/1] h-28">
            <img
              className="h-full w-full"
              src={
                authType === "member" ? loginMemberImage : loginCustomerImage
              }
              alt="티고캐릭터 이미지"
            />
          </div>
        </div>
      </div>

      <div className="bg-background flex flex-1 -translate-y-5 flex-col rounded-2xl pt-6 pr-7 pl-7">
        <Tabs
          defaultValue="member"
          className="flex-1"
          onValueChange={(v) => setAuthType(v as "member" | "customer")}
        >
          <TabsList className="mb-2 w-full">
            <TabsTrigger value="member" className="text-base">
              매장
            </TabsTrigger>
            <TabsTrigger value="customer" className="text-base">
              고객
            </TabsTrigger>
          </TabsList>

          {/* TabsContent */}
          <SignInMemberForm />
          <SignInCustomerForm />
        </Tabs>
      </div>
    </div>
  );
}
