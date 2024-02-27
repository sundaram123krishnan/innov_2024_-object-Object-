"use client";

import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import ThumbnailGenerator from "@/components/thumbnail-provider";

const videoFiles = ["stock-video-1.webm", "stock-video-2.webm"];

export default function Home() {
  return (
    <div className="flex gap-10 justify-evenly">
      {videoFiles.map((videoSrc) => {
        return (
          <CardContainer className="inter-var" key={videoSrc}>
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white"
              >
                {videoSrc}
              </CardItem>
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                metadata...
              </CardItem>
              <CardItem translateZ="100" className="w-full mt-4">
                <ThumbnailGenerator videoSrc={videoSrc} />
              </CardItem>
              <div className="flex justify-between items-center mt-20">
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                >
                  Add to watch later
                </CardItem>
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                >
                  Watch now
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        );
      })}
    </div>
  );
}
