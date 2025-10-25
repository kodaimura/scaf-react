import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import styles from "../../styles/pages/signup/signup.module.css";

export default function Signup() {
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const firstName = (form.elements.namedItem("first_name") as HTMLInputElement).value;
    const lastName = (form.elements.namedItem("last_name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      await api.post("accounts/signup", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      alert("登録が完了しました。ログインしてください。");
      navigate("/login");
    } catch (err: any) {
      alert(err.message || "登録に失敗しました");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>アカウント登録</h1>

        <label className={styles.label}>
          名
          <input type="text" name="first_name" required className={styles.input} />
        </label>

        <label className={styles.label}>
          姓
          <input type="text" name="last_name" required className={styles.input} />
        </label>

        <label className={styles.label}>
          メールアドレス
          <input type="email" name="email" required className={styles.input} />
        </label>

        <label className={styles.label}>
          パスワード
          <input type="password" name="password" required className={styles.input} />
        </label>

        <button type="submit" className={styles.button}>登録</button>

        <p className={styles.text}>
          すでにアカウントをお持ちですか？{" "}
          <a href="/login" className={styles.link}>ログイン</a>
        </p>
      </form>
    </div>
  );
}
