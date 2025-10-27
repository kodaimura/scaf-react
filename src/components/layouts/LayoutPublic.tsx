import HeaderPublic from "./HeaderPublic";
import Footer from "./Footer";
import styles from "../../styles/layouts/layout-public.module.css";

export default function LayoutPublic({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <HeaderPublic />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
