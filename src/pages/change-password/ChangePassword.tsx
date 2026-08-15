import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { api, HttpError } from "@lib/api";
import { getApiErrorMessage } from "@lib/errorMessages";
import { waitAtLeast, waitForProcessingPaint } from "@lib/loading";
import {
  PASSWORD_MIN_LENGTH,
  validatePasswordConfirmation,
  validateRequired,
} from "@lib/validation";
import { PASSWORD_CHANGED_PARAM, ROUTES } from "@/routes";
import {
  Button,
  ErrorMessage,
  FormField,
  Help,
  Input,
  Processing,
} from "@ui/index";
import styles from "@styles/pages/auth/auth.module.css";

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = (): string | null =>
    validateRequired(currentPassword, "現在のパスワード") ??
    validatePasswordConfirmation(newPassword, confirmPassword);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
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
      await api.put("accounts/me/password", {
        old_password: currentPassword,
        new_password: newPassword,
      });
      await waitAtLeast(startedAt);
      await logout();

      const params = new URLSearchParams({ [PASSWORD_CHANGED_PARAM]: "1" });
      navigate(`${ROUTES.login}?${params.toString()}`, { replace: true });
    } catch (err: unknown) {
      if (err instanceof HttpError && err.status === 401) {
        setError(
          getApiErrorMessage(err, "現在のパスワードを確認してください。"),
        );
      } else {
        setError("パスワードの変更に失敗しました。\nもう一度お試しください。");
      }
      await waitAtLeast(startedAt);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {loading && <Processing text="変更中..." />}
      <form
        className={[styles.form, styles.narrow].join(" ")}
        noValidate
        onSubmit={handleSubmit}
      >
        <h1 className={styles.title}>パスワード変更</h1>
        <p className={styles.description}>
          変更後は、新しいパスワードで再度ログインしてください。
        </p>

        <ErrorMessage className={styles.message} message={error} />

        <FormField htmlFor="current_password" label="現在のパスワード" required>
          <Input
            autoComplete="current-password"
            id="current_password"
            name="current_password"
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
            type="password"
            value={currentPassword}
          />
        </FormField>

        <FormField
          htmlFor="new_password"
          label={
            <span className={styles.labelWithHelp}>
              新しいパスワード
              <Help
                align="center"
                text={`${PASSWORD_MIN_LENGTH}文字以上で入力してください。`}
              />
            </span>
          }
          required
        >
          <Input
            autoComplete="new-password"
            id="new_password"
            minLength={PASSWORD_MIN_LENGTH}
            name="new_password"
            onChange={(event) => setNewPassword(event.target.value)}
            required
            type="password"
            value={newPassword}
          />
        </FormField>

        <FormField
          htmlFor="confirm_password"
          label="新しいパスワード（確認）"
          required
        >
          <Input
            autoComplete="new-password"
            id="confirm_password"
            minLength={PASSWORD_MIN_LENGTH}
            name="confirm_password"
            onChange={(event) => setConfirmPassword(event.target.value)}
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
          {loading ? "変更中..." : "パスワードを変更"}
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword;
