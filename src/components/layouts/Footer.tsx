import styles from "../../styles/layouts/footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>© {new Date().getFullYear()} MyApp. All rights reserved.</p>
    </footer>
  );
}
