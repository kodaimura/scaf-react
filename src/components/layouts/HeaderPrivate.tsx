import { Link } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import styles from "@styles/layouts/header.module.css";

const HeaderPrivate: React.FC = () => {
  const { logout } = useAuth();

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>
        <Link to="/">MyApp</Link>
      </h1>
      <nav className={styles.nav}>
        <button className={styles.logoutButton} onClick={logout}>
          ログアウト
        </button>
      </nav>
    </header>
  );
}

export default HeaderPrivate;