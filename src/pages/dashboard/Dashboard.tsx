import { useAuth } from "../../contexts/AuthContext";
import styles from "../../styles/pages/dashboard/dashboard.module.css";

export default function Dashboard() {
  const { account } = useAuth();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ダッシュボード</h1>
      {account ? (
        <p className={styles.text}>
          ようこそ、{account.first_name} {account.last_name} さん！
        </p>
      ) : (
        <p className={styles.text}>アカウント情報を取得できませんでした。</p>
      )}
    </div>
  );
}
