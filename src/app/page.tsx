"use client";

import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import ThumbnailGenerator from "@/components/thumbnail-provider";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

const videoFiles = Array.from({ length: 12 }).map(
  (_, idx) => `stock-video-${idx + 1}.webm`
);

type VideoMetadata = {
  description: string;
  name: string;
};

export default function Home() {
  const { toast } = useToast();
  const [allMetadata, setAllMetadata] = useState<VideoMetadata[]>([]);
  useEffect(() => {
    async function fetchJSON() {
      const allMetadata = await Promise.all(
        Array.from({ length: 12 }).map(async (_, idx) => {
          try {
            const response = await fetch(`stock-video-${idx + 1}.json`);
            const data: VideoMetadata = await response.json();
            return data;
          } catch (error) {
            return { description: "", name: "" };
          }
        })
      );
      setAllMetadata(allMetadata);
    }
    fetchJSON();
  }, []);

  async function addToWatchLater(filename: string) {
    const response = await fetch("/api/watch_later", {
      method: "POST",
      body: JSON.stringify(filename),
    });
    toast({
      title: response.ok ? "Success" : "Error",
      description: await response.text(),
    });
  }

  return (
    <div className="flex flex-wrap gap-8 justify-evenly px-2">
      <h2 className="border-b p-2 pt-6 -mb-2 text-3xl font-semibold tracking-tight first:mt-0 w-full">
        All videos
      </h2>
      {videoFiles.map((videoSrc, idx) => {
        return (
          <CardContainer className="inter-var" key={videoSrc}>
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white"
              >
                {allMetadata[idx]?.name}
              </CardItem>
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                {allMetadata[idx]?.description}
              </CardItem>
              <CardItem translateZ="100" className="w-full mt-4">
                <ThumbnailGenerator videoSrc={videoSrc} />
              </CardItem>
              <div className="flex justify-between items-center mt-20">
                <CardItem
                  translateZ={20}
                  className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                >
                  <Button
                    onClick={() => addToWatchLater(videoSrc)}
                    variant="ghost"
                  >
                    Add to watch later
                  </Button>
                </CardItem>
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                >
                  <Link href={`/video/${videoSrc}`}>Watch now</Link>
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        );
      })}
    </div>
  );
}
