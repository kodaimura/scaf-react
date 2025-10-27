import HeaderPrivate from "./HeaderPrivate";
import Footer from "./Footer";
import styles from "../../styles/layouts/layout-private.module.css";

export default function LayoutPrivate({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <HeaderPrivate />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
