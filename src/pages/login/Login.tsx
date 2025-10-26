import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, HttpError } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import type { Account } from "../../types/models";
import styles from "../../styles/pages/login/login.module.css";

interface LoginResponse {
  account: Account;
  access_token: string;
}

export default function Login() {
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

    setLoading(true);
    try {
      const res: LoginResponse = await api.post("accounts/login", { email, password });

      setAccount(res.account);
      setAccessToken(res.access_token);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("ログイン失敗:", err);
      if (err instanceof HttpError && err.status === 401) {
        setError("メールアドレスまたはパスワードが間違っています。");
      } else {
        setError("ログインに失敗しました。もう一度お試しください。");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- UI ---
  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <h1 className={styles.title}>ログイン</h1>

        {/* エラー表示 */}
        {error && <p className={styles.error}>{error}</p>}

        <label className={styles.label}>
          メールアドレス
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          パスワード
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </label>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "ログイン中..." : "ログイン"}
        </button>

        <p className={styles.text}>
          アカウントをお持ちでない方は{" "}
          <a href="/signup" className={styles.link}>
            登録はこちら
          </a>
        </p>
      </form>
    </div>
  );
}
