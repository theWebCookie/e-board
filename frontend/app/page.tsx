import styles from './page.module.css';
import ToolPicker from './components/ToolPicker/ToolPicker';

export default function Home() {
  return (
    <main className={styles.main}>
      <ToolPicker />
    </main>
  );
}
