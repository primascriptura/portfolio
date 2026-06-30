import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.center}>
        <h1 className={styles.mark}>IH</h1>
        <p className={styles.role}>Product Designer</p>
      </div>
    </main>
  );
}
