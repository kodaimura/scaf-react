import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import styles from "../../styles/pages/login/login.module.css";
import { useAuth } from "../../contexts/AuthContext";
import type { Account } from "../../types/models";

interface LoginResponse {
  account: Account;
  access_token: string;
}

export default function Login() {
  const { setAccount, setAccessToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res: LoginResponse = await api.post("accounts/login", { email, password });
      setAccount(res.account);
      setAccessToken(res.access_token);
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.message || "ログインに失敗しました");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>ログイン</h1>

        <label className={styles.label}>
          メールアドレス
          <input type="email" name="email" required className={styles.input} />
        </label>

        <label className={styles.label}>
          パスワード
          <input type="password" name="password" required className={styles.input} />
        </label>

        <button type="submit" className={styles.button}>
          ログイン
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
