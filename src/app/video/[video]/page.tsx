"use client";

import VideoPlayer from "@/components/video-player";
import { useEffect } from "react";

export default function Page({ params }: { params: { video: string } }) {
  useEffect(() => {
    fetch("/api/history", {
      method: "POST",
      body: JSON.stringify(params.video)
    });
  });

  return <VideoPlayer src={`/${params.video}`} />;
}
