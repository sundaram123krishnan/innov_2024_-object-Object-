"use client";

import VideoPlayer from "@/components/video-player";

export default function Page({ params }: { params: { video: string } }) {
  return <VideoPlayer src={`/${params.video}`} />;
}
