import "../globals.css";
import styles from "./App.module.css";
import { WordCarousel } from "./components/common/WordCarousel/WordCarousel";
import { Word } from "./components/common/WordCarousel/Word";

export default async function App() {
  return (
    <div className={styles.container}>
      <div className={styles.frame}>
        <h1 className={styles.heading}>
          Effortlessly convert your audio files to <WordCarousel wordArray={["MP3", "WAV", "FLAC", "OGG", "MP4"]} /> in
          seconds.
        </h1>
        <button className={styles.fileInput}>Choose file...</button>
      </div>
    </div>
  );
}
