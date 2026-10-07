import { useEffect, useRef, useState } from "react";
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
  onReadyChange,
}: {
  reply: ReplyType;
  theme: string;
  onReadyChange?: (ready: boolean) => void;
}) {
  const avatarRef = useRef<HTMLImageElement>(null);
  const mediaRef = useRef<HTMLImageElement>(null);

  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);

  const media = reply.media?.all[0];
  const fa = isPersian(reply.text);

  const hasMedia = media?.type === "photo" || media?.type === "video";
  const ready = avatarLoaded && mediaLoaded;

  useEffect(() => {
    setAvatarLoaded(avatarRef.current?.complete ?? false);
    setMediaLoaded(hasMedia ? (mediaRef.current?.complete ?? false) : true);
  }, [reply, hasMedia]);

  useEffect(() => {
    onReadyChange?.(ready);
  }, [ready, onReadyChange]);

  return (
    <div
      className={styles[`replyCard__${theme}`]}
      style={{ visibility: ready ? "visible" : "hidden" }}
    >
      <div className={styles[`replyHeader__${theme}`]}>
        <img
          key={reply.author.avatar_url}
          ref={avatarRef}
          src={reply.author.avatar_url}
          alt="avatar"
          className={styles[`replyAvatar__${theme}`]}
          onLoad={() => setAvatarLoaded(true)}
          onError={() => setAvatarLoaded(true)}
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
          key={media.url}
          ref={mediaRef}
          className={styles[`replyImage__${theme}`]}
          src={media.url}
          alt="Reply media"
          onLoad={() => setMediaLoaded(true)}
          onError={() => setMediaLoaded(true)}
        />
      )}

      {media?.type === "video" && (
        <div className={styles[`replyVideo__${theme}`]}>
          <img
            key={media.thumbnail_url}
            ref={mediaRef}
            src={media.thumbnail_url}
            alt="Video thumbnail"
            onLoad={() => setMediaLoaded(true)}
            onError={() => setMediaLoaded(true)}
          />

          <div className={styles[`replyPlayButton__${theme}`]}>
            <FaPlay />
          </div>
        </div>
      )}
    </div>
  );
}