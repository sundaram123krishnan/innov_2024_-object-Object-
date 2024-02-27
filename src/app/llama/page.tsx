"use client";

import VideoPlayer from "@/components/video-player";
import MyComponent from "../../components/llama-prompt";

//LL-dlIgQVFTLtpQ66uuFfPlW2DMMtbq317E8KmWvS3l6CQv7KB6zmBaeuVKPBfWlyrC

export default function Home() {
  return (
    <div>
      <NavbarDemo />
      <VideoPlayer src="/stock-video-2.webm" />
      <MyComponent />
    </div>
  );
}
