import assert from "node:assert/strict";
import test from "node:test";
import {
  validateEmail,
  validatePasswordConfirmation,
} from "../src/lib/validation.ts";
import {
  buildLoginPathWithFrom,
  getSafeRedirectPath,
  ROUTES,
} from "../src/routes.ts";

test("validates authentication input", () => {
  assert.equal(validateEmail(""), "メールアドレスを入力してください。");
  assert.equal(
    validateEmail("invalid"),
    "メールアドレスの形式が正しくありません。",
  );
  assert.equal(validateEmail("user@example.com"), null);
  assert.equal(
    validatePasswordConfirmation("short", "short"),
    "パスワードは8文字以上で入力してください。",
  );
  assert.equal(
    validatePasswordConfirmation("Password123!", "Password456!"),
    "パスワードが一致しません。",
  );
  assert.equal(
    validatePasswordConfirmation("Password123!", "Password123!"),
    null,
  );
});

test("keeps post-login redirects inside the application", () => {
  assert.equal(
    buildLoginPathWithFrom("/change-password?source=menu"),
    "/login?from=%2Fchange-password%3Fsource%3Dmenu",
  );
  assert.equal(
    getSafeRedirectPath("/change-password?source=menu#password"),
    "/change-password?source=menu#password",
  );
  assert.equal(getSafeRedirectPath("https://example.com"), ROUTES.dashboard);
  assert.equal(getSafeRedirectPath("//example.com"), ROUTES.dashboard);
  assert.equal(getSafeRedirectPath(ROUTES.login), ROUTES.dashboard);
});
