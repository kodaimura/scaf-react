import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, HttpError } from "../../lib/api";
import styles from "../../styles/pages/signup/signup.module.css";

export default function Signup() {
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
    if (password.length < 8)
      return "パスワードは8文字以上で入力してください。";
    if (password !== confirmPassword)
      return "パスワードが一致しません。";
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
      await api.post("accounts/signup", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });

      navigate("/login");
    } catch (err: any) {
      console.error("サインアップ失敗:", err);
      if (err instanceof HttpError && err.status === 409) {
        setError("メールアドレスは既に登録されています。");
      } else {
        setError("登録に失敗しました。もう一度お試しください。");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <h1 className={styles.title}>アカウント登録</h1>

        {error && <p className={styles.error}>{error}</p>}

        <label className={styles.label}>
          姓
          <input
            type="text"
            name="last_name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          名
          <input
            type="text"
            name="first_name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className={styles.input}
          />
        </label>

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
            minLength={8}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          パスワード（確認）
          <input
            type="password"
            name="confirm_password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className={styles.input}
          />
        </label>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "登録中..." : "登録"}
        </button>

        <p className={styles.text}>
          すでにアカウントをお持ちですか？{" "}
          <a href="/login" className={styles.link}>ログイン</a>
        </p>
      </form>
    </div>
  );
}
