import { Link } from "react-router-dom";
import { LogOut, UserCircle } from "lucide-react";
import { useAuth } from "@contexts/AuthContext";
import { KebabMenu } from "@ui/index";
import styles from "@styles/layouts/header.module.css";

const HeaderPrivate: React.FC = () => {
  const { account, logout } = useAuth();
  const accountName = account
    ? `${account.last_name} ${account.first_name}`.trim()
    : "Account";

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>
        <Link to="/">MyApp</Link>
      </h1>
      <nav className={styles.nav}>
        <span className={styles.accountName}>{accountName}</span>
        <KebabMenu
          ariaLabel="アカウントメニューを開く"
          icon={<UserCircle size={20} />}
          items={[
            {
              icon: <LogOut size={16} />,
              label: "ログアウト",
              onClick: logout,
            },
          ]}
        />
      </nav>
    </header>
  );
};

export default HeaderPrivate;
