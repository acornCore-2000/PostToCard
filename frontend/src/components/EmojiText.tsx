import { useEffect, useRef } from "react";
import twemoji from "@twemoji/api";

interface EmojiTextProps {
  text: string;
}

export default function EmojiText({ text }: EmojiTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.textContent = text;

    twemoji.parse(ref.current, {
      folder: "svg",
      ext: ".svg",
      className: "emoji",
    });

    const emojis = ref.current.querySelectorAll<HTMLImageElement>(".emoji");

    emojis.forEach((emoji) => {
      emoji.style.width = "1.15em";
      emoji.style.height = "1.15em";
      emoji.style.display = "inline-block";
      emoji.style.verticalAlign = "-0.15em";
    });
  }, [text]);

  return <span ref={ref} />;
}