import { FaPlay } from "react-icons/fa6";
import { VscVerifiedFilled } from "react-icons/vsc";
import styles from "./TweetReply.module.css";
import EmojiText from "./EmojiText";

interface MediaItem {
  type: string;
  url: string;
  thumbnail_url?: string;
  width: number;
  height: number;
}

export interface ReplyType {
  text: string;
  media: {
    all: MediaItem[];
  };
  author: {
    screen_name: string;
    name: string;
    avatar_url: string;
    verification: {
      verified: boolean;
      type: string;
    };
  };
}

function isPersian(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

export default function TweetReply({
  reply,
  theme,
}: {
  reply: ReplyType;
  theme: string;
}) {
  const media = reply.media?.all[0];
  const fa = isPersian(reply.text);

  return (
    <div className={styles[`replyCard__${theme}`]}>
      <div className={styles[`replyHeader__${theme}`]}>
        <img
          src={reply.author.avatar_url}
          alt="avatar"
          className={styles[`replyAvatar__${theme}`]}
        />

        <div className={styles[`replyAuthorInfo__${theme}`]}>
          <div className={styles[`replyAuthor__${theme}`]}>
            <span>
              <EmojiText text={reply.author.name} />
            </span>

            {reply.author.verification.verified && (
              <VscVerifiedFilled
                className={
                  reply.author.verification.type === "government"
                    ? styles[`replyVerifiedGovernment__${theme}`]
                    : styles[`replyVerifiedIndividual__${theme}`]
                }
              />
            )}
          </div>

          <span className={styles[`replyScreenName__${theme}`]}>
            @{reply.author.screen_name}
          </span>
        </div>
      </div>

      <p className={styles[`replyText__${theme}`]} lang={fa ? "fa" : "en"}>
        <EmojiText text={reply.text.slice(0, 150)} />{" "}
        {fa
          ? reply.text.length >= 50 && (
              <span className={styles[`replyMore__${theme}`]}>بیشتر...</span>
            )
          : reply.text.length >= 50 && (
              <span className={styles[`replyMore__${theme}`]}>more...</span>
            )}
      </p>

      {media?.type === "photo" && (
        <img
          className={styles[`replyImage__${theme}`]}
          src={media.url}
          alt="Reply media"
        />
      )}

      {media?.type === "video" && (
        <div className={styles[`replyVideo__${theme}`]}>
          <img
            src={media.thumbnail_url}
            alt="Video thumbnail"
          />

          <div className={styles[`replyPlayButton__${theme}`]}>
            <FaPlay />
          </div>
        </div>
      )}
    </div>
  );
}