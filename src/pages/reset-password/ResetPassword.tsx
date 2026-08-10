import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, HttpError } from "@lib/api";
import { waitAtLeast, waitForProcessingPaint } from "@lib/loading";
import {
  Button,
  ErrorMessage,
  FormField,
  Help,
  InfoMessage,
  Input,
  Processing,
} from "@ui/index";
import styles from "@styles/pages/auth/auth.module.css";

type VerificationState = "checking" | "valid" | "invalid";

const getTokenErrorMessage = (err: unknown) => {
  if (!(err instanceof HttpError)) {
    return "再設定リンクを確認できませんでした。";
  }

  if (err.code === "TOKEN_EXPIRED") {
    return "再設定リンクの有効期限が切れています。";
  }
  if (err.code === "TOKEN_ALREADY_USED") {
    return "この再設定リンクは既に使用されています。";
  }
  if (err.code === "TOKEN_INVALID") {
    return "再設定リンクが正しくありません。";
  }

  return "再設定リンクを確認できませんでした。";
};

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] =
    useState<VerificationState>("checking");

  useEffect(() => {
    let active = true;

    const verifyToken = async () => {
      if (!token) {
        setError("再設定リンクが正しくありません。");
        setVerification("invalid");
        return;
      }

      try {
        await api.get("auth/reset-password/verify", { token });
        if (!active) return;
        setVerification("valid");
      } catch (err) {
        if (!active) return;
        setError(getTokenErrorMessage(err));
        setVerification("invalid");
      }
    };

    verifyToken();

    return () => {
      active = false;
    };
  }, [token]);

  const validate = (): string | null => {
    if (password.length < 8) return "パスワードは8文字以上で入力してください。";
    if (password !== confirmPassword) return "パスワードが一致しません。";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const startedAt = Date.now();
    setLoading(true);
    await waitForProcessingPaint();

    try {
      await api.post("auth/reset-password", {
        token,
        new_password: password,
      });
      setSucceeded(true);
    } catch (err) {
      setError(getTokenErrorMessage(err));
      setVerification("invalid");
    } finally {
      await waitAtLeast(startedAt);
      setLoading(false);
    }
  };

  const isTokenChecking = verification === "checking";
  const canSubmit = verification === "valid" && !succeeded;

  return (
    <div className={styles.container}>
      {(loading || isTokenChecking) && (
        <Processing text={isTokenChecking ? "確認中..." : "更新中..."} />
      )}
      <form
        onSubmit={handleSubmit}
        className={[styles.form, styles.narrow].join(" ")}
        noValidate
      >
        <h1 className={styles.title}>新しいパスワード</h1>
        <p className={styles.description}>
          メールに記載されたリンクから、新しいパスワードを設定します。
        </p>

        <ErrorMessage className={styles.message} message={error} />

        {succeeded && (
          <InfoMessage className={styles.message}>
            パスワードを更新しました。新しいパスワードでログインしてください。
          </InfoMessage>
        )}

        {canSubmit && (
          <>
            <FormField
              htmlFor="password"
              label={
                <span className={styles.labelWithHelp}>
                  新しいパスワード
                  <Help align="center" text="8文字以上で入力してください。" />
                </span>
              }
              required
            >
              <Input
                id="password"
                minLength={8}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                value={password}
              />
            </FormField>

            <FormField
              htmlFor="confirm_password"
              label="新しいパスワード（確認）"
              required
            >
              <Input
                id="confirm_password"
                minLength={8}
                name="confirm_password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                type="password"
                value={confirmPassword}
              />
            </FormField>

            <Button
              className={styles.button}
              disabled={loading}
              loading={loading}
              type="submit"
            >
              {loading ? "更新中..." : "パスワードを更新"}
            </Button>
          </>
        )}

        <p className={styles.text}>
          <Link to="/login" className={styles.link}>
            ログインへ戻る
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
