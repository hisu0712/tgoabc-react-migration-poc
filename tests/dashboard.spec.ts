import { test, expect } from "@playwright/test";

if (!process.env.PLAYWRIGHT_DEMO_EMAIL || !process.env.PLAYWRIGHT_DEMO_PASSWORD)
  throw new Error(
    "이메일 혹은 비밀번호가 .env.local에 설정되어 있지 않습니다.",
  );

test("회원 로그인 후 대시보드 진입", async ({ page }) => {
  await page.goto("/sign-in");

  await page
    .getByPlaceholder("이메일(아이디) 입력")
    .fill(process.env.PLAYWRIGHT_DEMO_EMAIL!);
  await page
    .getByPlaceholder("비밀번호 입력")
    .fill(process.env.PLAYWRIGHT_DEMO_PASSWORD!);
  await page.getByRole("button", { name: "로그인" }).click();

  await page.getByRole("link", { name: "대시보드" }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText("고객별 통계")).toBeVisible();
});
