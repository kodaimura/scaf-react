import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, HttpError } from "@lib/api";
import { waitAtLeast, waitForProcessingPaint } from "@lib/loading";
import {
  Button,
  ErrorMessage,
  FormField,
  Help,
  Input,
  Processing,
} from "@ui/index";
import styles from "@styles/pages/signup/signup.module.css";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    if (!lastName.trim()) return "姓を入力してください。";
    if (!firstName.trim()) return "名を入力してください。";
    if (!email.trim()) return "メールアドレスを入力してください。";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "メールアドレスの形式が正しくありません。";
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
      await api.post("auth/signup", {
        login_id: email,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });

      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof HttpError && err.status === 409) {
        setError("メールアドレスは既に登録されています。");
      } else {
        setError("登録に失敗しました。\nもう一度お試しください。");
      }
    } finally {
      await waitAtLeast(startedAt);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {loading && <Processing text="登録中..." />}
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <h1 className={styles.title}>アカウント登録</h1>

        <ErrorMessage className={styles.error} message={error} />

        <FormField htmlFor="last_name" label="姓" required>
          <Input
            id="last_name"
            type="text"
            name="last_name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </FormField>

        <FormField htmlFor="first_name" label="名" required>
          <Input
            id="first_name"
            type="text"
            name="first_name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </FormField>

        <FormField htmlFor="email" label="メールアドレス" required>
          <Input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormField>

        <FormField
          htmlFor="password"
          label={
            <span className={styles.labelWithHelp}>
              パスワード
              <Help align="center" text="8文字以上で入力してください。" />
            </span>
          }
          required
        >
          <Input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </FormField>

        <FormField
          htmlFor="confirm_password"
          label="パスワード（確認）"
          required
        >
          <Input
            id="confirm_password"
            type="password"
            name="confirm_password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />
        </FormField>

        <Button
          type="submit"
          className={styles.button}
          disabled={loading}
          loading={loading}
        >
          {loading ? "登録中..." : "登録"}
        </Button>

        <p className={styles.text}>
          すでにアカウントをお持ちですか？{" "}
          <Link to="/login" className={styles.link}>
            ログイン
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
