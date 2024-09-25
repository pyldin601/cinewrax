import "../globals.css";
import styles from "./App.module.css";

export default async function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.frame}>
        <h1 className={styles.heading}>Effortlessly convert your audio files to any audio format in seconds.</h1>
        {/*<button className={styles.fileInput}>Choose file...</button>*/}
      </div>
    </div>
  );
}
