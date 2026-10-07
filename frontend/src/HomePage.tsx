import { useState, useRef } from "react";
import axios from "axios";
import PostCard from "./components/PostCard";
import styles from "./HomePage.module.css";
import type { TweetType } from "./components/PostCard";
import { toPng } from "html-to-image";

export default function HomePage() {
  const [link, setLink] = useState("");
  const [theme, setTheme] = useState("");
  const [tweet, setTweet] = useState<TweetType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCardReady(false);
      setIsLoading(true);
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${API_URL}/api/tweet-info`, {
        params: { url: link },
      });

      if (response.data.success) {
        setTweet(response.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (cardRef.current) {
      await document.fonts.ready;

      const node = cardRef.current;
      const options = { pixelRatio: 3, quality: 1,};

      await toPng(node, options);
      const dataUrl: string = await toPng(node, options);

      const a = document.createElement("a");
      a.download = "post.png";
      a.href = dataUrl;
      a.click();
    }
  };

  const showSpinner = isLoading || (tweet !== null && !cardReady);

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

        {showSpinner && <div className={styles.spinner} />}

        {tweet && !isLoading && (
          <div
            className={styles.resultWrapper}
            style={
              cardReady
                ? undefined
                : {
                    position: "absolute",
                    visibility: "hidden",
                    pointerEvents: "none",
                  }
            }
          >
            <div className={styles.result} ref={cardRef}>
              <PostCard
                tweet={tweet}
                theme={theme}
                onReadyChange={setCardReady}
              />
            </div>
            <button
              type="button"
              className={styles.downloadButton}
              onClick={handleDownload}
              disabled={!cardReady}
            >
              Download
            </button>
          </div>
        )}
      </div>
    </main>
  );
}