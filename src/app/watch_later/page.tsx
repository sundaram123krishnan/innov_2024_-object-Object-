"use client";

import ThumbnailGenerator from "@/components/thumbnail-provider";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WatchLater() {
  const [data, setData] = useState<{
    toWatchLater: string[];
  }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/watch_later")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  const uniqueWatchSet = new Set(data?.toWatchLater);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const uniqueWatchList = Array.from(uniqueWatchSet);

  const [allMetadata, setAllMetadata] = useState<VideoMetadata[]>([]);
  useEffect(() => {
    async function fetchJSON() {
      const allMetadata = await Promise.all(
        uniqueWatchList.map(async (_, idx) => {
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
  }, [uniqueWatchList]);

  return (
    <div className="flex flex-wrap gap-10 justify-evenly">
      {uniqueWatchList.map((filename, idx) => {
        return (
          <CardContainer className="inter-var" key={filename}>
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
                <ThumbnailGenerator videoSrc={filename} />
              </CardItem>
              <div className="flex justify-end items-center mt-20">
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                >
                  <Link href={`/video/${filename}`}>Watch now</Link>
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        );
      })}
    </div>
  );
}
