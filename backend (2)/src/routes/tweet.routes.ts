import { Router } from "express";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";


const router = Router();
// const proxyAgent = new HttpsProxyAgent(
//   "http://192.168.49.1:8181"
// );


interface QuoteType {
  text: string;
  media?:{
    all :MediaItem[]
  }
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

interface MediaItem {
  type: string;
  url: string;
  thumbnail_url? : string;
  width: number;
  height: number;
}

interface TweetType {
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
  quote?: QuoteType;
}

export function filterTweetData(raw: any): TweetType {
  const tweet = raw.tweet;

  return {
    url: tweet.url,
    text: tweet.text,
    created_at: tweet.created_at,
    lang: tweet.lang,
    likes: tweet.likes,
    replies: tweet.replies,
    bookmarks: tweet.bookmarks,
    quotes: tweet.quotes,
    views: tweet.views,
    provider: tweet.provider,
    author: {
      screen_name: tweet.author.screen_name,
      name: tweet.author.name,
      avatar_url: tweet.author.avatar_url,
      verification: {
        verified: tweet.author.verification?.verified ?? false,
        type: tweet.author.verification?.type 
      },
    },
    media: {
      all: tweet.media?.all ?? [],
    },
    quote: tweet.quote,
  };
}

router.get("/tweet-info", async (req, res) => {
  try {
    const tweetUrl = req.query.url as string;

    if (!tweetUrl) {
      return res.status(400).json({ error: "url is required." });
    }
    const tweetId = tweetUrl.split("/status/")[1]?.split("?")[0];
    if (!tweetId) {
      throw new Error("Invalid tweet URL");
    }
    const result = await axios.get(
      `https://api.fxtwitter.com/status/${tweetId}`,
      {
    // httpsAgent: proxyAgent,
    // proxy: false,
  }
    );

    const filtered = filterTweetData(result.data);
    console.log(filtered);
    return res.status(200).json({ message: filtered, success: true });
  } catch (error: any) {
    console.error(error.response?.status, error.response?.data || error.message);
    return res.status(500).json({ success: false });
  }
});

export default router;