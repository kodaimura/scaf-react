import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, HttpError } from "@lib/api";
import { waitAtLeast, waitForProcessingPaint } from "@lib/loading";
import { useAuth } from "@contexts/AuthContext";
import { Button, ErrorMessage, FormField, Input, Processing } from "@ui/index";
import type { Account } from "types/models";
import styles from "@styles/pages/login/login.module.css";

interface LoginResponse {
  account: Account;
  access_token: string;
}

const Login: React.FC = () => {
  const { setAccount, setAccessToken } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    if (!email.trim()) return "メールアドレスを入力してください。";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "メールアドレスの形式が正しくありません。";
    if (!password.trim()) return "パスワードを入力してください。";
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
      const res: LoginResponse = await api.post("auth/login", {
        login_id: email,
        password,
      });

      setAccount(res.account);
      setAccessToken(res.access_token);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof HttpError && err.status === 401) {
        setError("メールアドレスまたはパスワードが間違っています。");
      } else {
        setError("ログインに失敗しました。\nもう一度お試しください。");
      }
    } finally {
      await waitAtLeast(startedAt);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {loading && <Processing text="ログイン中..." />}
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <h1 className={styles.title}>ログイン</h1>

        <ErrorMessage className={styles.error} message={error} />

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

        <FormField htmlFor="password" label="パスワード" required>
          <Input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormField>

        <Button
          type="submit"
          className={styles.button}
          disabled={loading}
          loading={loading}
        >
          {loading ? "ログイン中..." : "ログイン"}
        </Button>

        <p className={styles.text}>
          アカウントをお持ちでない方は{" "}
          <Link to="/signup" className={styles.link}>
            登録はこちら
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
