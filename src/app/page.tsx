"use client";

import VideoPlayer from "@/components/video-player";
import { NavbarDemo } from "./Navbar";

export default function Home() {
  return (
    <div>
      <NavbarDemo />
      <VideoPlayer src="/stock-video-2.webm" />
    </div>
  );
}
