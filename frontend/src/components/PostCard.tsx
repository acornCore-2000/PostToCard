import { useEffect, useRef } from "react";
import { FaHeart, FaRegBookmark, FaRetweet, FaRegEye } from "react-icons/fa6";
import { VscVerifiedFilled } from "react-icons/vsc";
import styles from "./PostCard.module.css";
import QRCodeStyling from "qr-code-styling";
import { renderToStaticMarkup } from "react-dom/server";
import { FaXTwitter } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import TweetReply, { type ReplyType } from "./TweetReply";
import EmojiText from "./EmojiText";

interface MediaItem {
  type: string;
  url: string;
  thumbnail_url?: string;
  width: number;
  height: number;
}

export interface TweetType {
  url: string;
  text: string;
  created_at: string;
  lang: string;
  likes: number;
  replies: number;
  bookmarks: number;
  quotes: number;
  views: number;
  provider: string;
  author: {
    screen_name: string;
    name: string;
    avatar_url: string;
    verification: {
      verified: boolean;
      type: string;
    };
  };
  media: {
    all: MediaItem[];
  };
  quote?: ReplyType;
}

function formatNumber(num: number | null): string {
  if (num === null) {
    return "—";
  }

  if (num >= 1_000_000) {
    return `${Number((num / 1_000_000).toFixed(1))}M`;
  }

  if (num >= 1_000) {
    return `${Number((num / 1_000).toFixed(1))}K`;
  }

  return num.toString();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTweetText(text: string) {
  const pattern =
    /(^|\s)(\[(#[\p{L}\p{N}_\u200C\u200D-]+)\]\((https?:\/\/[^\s)]+)\)|https?:\/\/[^\s]+|www\.[^\s]+|@[a-zA-Z0-9_]+|#[\p{L}\p{N}_\u200C\u200D-]+)/gu;

  const parts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const fullMatch = match[0];
    const whitespace = match[1];
    const value = match[2];

    const start = match.index;

    parts.push(text.slice(lastIndex, start));
    parts.push(whitespace);

    if (value.startsWith("[")) {
      const hashtag = match[3];
      const url = match[4];

      parts.push(
        <a
          key={`link-${start}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          {hashtag}
        </a>,
      );
    } else if (
      value.startsWith("http://") ||
      value.startsWith("https://")
    ) {
      parts.push(
        <a
          key={`link-${start}`}
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          {value}
        </a>,
      );
    } else if (value.startsWith("www.")) {
      parts.push(
        <a
          key={`link-${start}`}
          href={`https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          {value}
        </a>,
      );
    } else {
      parts.push(
        <span key={`mention-${start}`} className={styles.link}>
          {value}
        </span>,
      );
    }

    lastIndex = start + fullMatch.length;
  }

  parts.push(text.slice(lastIndex));

  return parts;
}

export default function PostCard({
  tweet,
  theme,
}: {
  tweet: TweetType;
  theme: string;
}) {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tweet.provider !== "twitter") return;

    if (qrRef.current) {
      qrRef.current.innerHTML = "";

      const xSvg = renderToStaticMarkup(
        <FaXTwitter
          color={theme === "dark" ? "#f5f5f7" : "#1c1c1e"}
          size={20}
        />,
      );

      const xLogo = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
        xSvg,
      )}`;

      const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        type: "svg",
        data: tweet.url,

        image: xLogo,

        qrOptions: {
          errorCorrectionLevel: "H",
        },

        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.35,
          margin: 2,
        },

        dotsOptions: {
          type: "rounded",
          color: theme === "dark" ? "#F5F5F7" : "#8E8E93",
        },

        backgroundOptions: {
          color: "transparent",
        },
      });

      qrCode.append(qrRef.current);
    }
  }, [tweet.url, tweet.provider, theme]);

  return (
    <div className={styles[`postCard__${theme}`]}>
      <div className={styles[`header__${theme}`]}>
        <img
          src={tweet.author.avatar_url}
          alt="avatar"
          className={styles[`avatar__${theme}`]}
        />

        <div className={styles[`authorInfo__${theme}`]}>
          <span className={styles[`author__${theme}`]}>
            <EmojiText text={tweet.author.name} />

            {tweet.author.verification.verified && (
              <VscVerifiedFilled
                className={
                  tweet.author.verification.type === "government"
                    ? styles[`verifiedBadge__government__${theme}`]
                    : styles[`verifiedBadge__individual__${theme}`]
                }
              />
            )}
          </span>

          <span className={styles[`screenName__${theme}`]}>
            @{tweet.author.screen_name}
          </span>
        </div>

        <div>
          {tweet.provider === "twitter" && (
            <div
              ref={qrRef}
              className={styles[`qrcode__${theme}`]}
            />
          )}
        </div>
      </div>

      <p className={styles[`text__${theme}`]} lang={tweet.lang}>
        {formatTweetText(tweet.text.slice(0, 300)).map((part, index) =>
          typeof part === "string" ? (
            <EmojiText key={index} text={part} />
          ) : (
            part
          ),
        )}{" "}
        {tweet.text.length >= 100 && tweet.lang === "en" ? (
          <span className={styles[`more__${theme}`]}>more...</span>
        ) : (
          tweet.lang === "fa" &&
          tweet.text.length >= 200 && (
            <span className={styles[`more__${theme}`]}>بیشتر...</span>
          )
        )}
      </p>

      {tweet.media.all[0]?.type === "photo" && (
        <img
          className={styles[`image__${theme}`]}
          src={tweet.media.all[0].url}
          alt="Post image"
        />
      )}

      {tweet.media.all[0]?.type === "video" && (
        <div className={styles[`videoContainer__${theme}`]}>
          <img
            className={styles[`video__${theme}`]}
            src={
              tweet.media.all[0].thumbnail_url ??
              tweet.media.all[0].url
            }
            alt="Video thumbnail"
          />

          <div className={styles[`playButton__${theme}`]}>
            <FaPlay />
          </div>
        </div>
      )}

      {tweet.quote && (
        <TweetReply
          reply={tweet.quote}
          theme={theme}
        />
      )}

      <div className={styles[`stats__${theme}`]}>
        <span
          className={`${styles[`stat__${theme}`]} ${styles[`statLikes__${theme}`]}`}
        >
          <FaHeart />
          {formatNumber(tweet.likes)}
        </span>

        <span
          className={`${styles[`stat__${theme}`]} ${styles[`statReposts__${theme}`]}`}
        >
          <FaRetweet />
          {formatNumber(tweet.quotes)}
        </span>

        <span
          className={`${styles[`stat__${theme}`]} ${styles[`statViews__${theme}`]}`}
        >
          <FaRegBookmark />
          {formatNumber(tweet.bookmarks)}
        </span>

        <span
          className={`${styles[`stat__${theme}`]} ${styles[`statViews__${theme}`]}`}
        >
          <FaRegEye />
          {formatNumber(tweet.views)}
        </span>
      </div>

      <div className={styles[`footer__${theme}`]}>
        <span className={styles[`date__${theme}`]}>
          {formatDate(tweet.created_at)}
        </span>
      </div>
    </div>
  );
}