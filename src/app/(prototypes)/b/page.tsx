import { featuredWork } from '@/content/featured-work';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>Prototype — Version B</p>
      <h1 className={styles.headline}>jkane.co layout and clean grid</h1>
      <p className={styles.sub}>
        Architecture scaffold — proves route, token, and component isolation
        from Version A and the live site. Visual direction not designed yet.
      </p>

      <ul className={styles.workList}>
        {featuredWork.map((item) => (
          <li key={item.slug} className={styles.workItem}>
            <span className={styles.workTitle}>{item.title}</span>
            <span className={styles.workMeta}>{item.meta}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
