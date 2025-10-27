import { Link } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import styles from "@styles/layouts/header.module.css";

const HeaderPrivate: React.FC = () => {
  const { account, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.logo}>
          <Link to="/dashboard">MyApp</Link>
        </h1>
        <nav className={styles.nav}>
          <Link to="/dashboard" className={styles.link}>
            ダッシュボード
          </Link>
          <Link to="/home" className={styles.link}>
            ホーム
          </Link>
          <button className={styles.logoutButton} onClick={logout}>
            ログアウト
          </button>
          {account && <span className={styles.user}>{account.first_name}</span>}
        </nav>
      </div>
    </header>
  );
}

export default HeaderPrivate;