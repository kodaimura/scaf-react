import { Link } from "react-router-dom";
import styles from "../../styles/layouts/header.module.css";

const HeaderPublic: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.logo}>
          <Link to="/">MyApp</Link>
        </h1>
      </div>
    </header>
  );
}

export default HeaderPublic;