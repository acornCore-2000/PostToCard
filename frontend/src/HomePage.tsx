import { useState, useRef } from "react";
import axios from "axios";
import PostCard from "./components/PostCard";
import styles from "./HomePage.module.css";
import type { TweetType } from "./components/PostCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toPng } from "html-to-image";

export default function HomePage() {
  const [link, setLink] = useState("");
  const [theme, setTheme] = useState("");
  const [tweet, setTweet] = useState<TweetType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTweet, setShowTweet] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.get(`https://sonnet-timely-polar-bear.abasthan.app/api/tweet-info`, {
        params: { url: link },
      });

      if (response.data.success) {
        setTweet(response.data.message);
        setShowTweet(true);
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async ()=>{
if (cardRef.current){
  const dataUrl = await toPng(cardRef.current, {
    pixelRatio:3, 
    quality:1
  });
  
   const link = document.createElement('a');
      link.download = 'post.png';
      link.href = dataUrl;
      link.click();
}
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Post to Image</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Enter link"
            required
          />
          <select
            className={styles.select}
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            required
          >
            <option value="" disabled hidden>
              Select a theme
            </option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <button className={styles.button} type="submit">
            Submit
          </button>
        </form>

        {showTweet && tweet && !isLoading ? (
          <div className={styles.resultWrapper}>
  <div className={styles.result} ref={cardRef}>
    <PostCard tweet={tweet} theme={theme} />
  </div>
  <button
    type="button"
    className={styles.downloadButton}
    onClick={handleDownload}
  >
    Download
  </button>
</div>
        ) : (
          <div>
            <Skeleton width={500} />
            <Skeleton height={500} />
          </div>
        )}
      </div>
    </main>
  );
}
