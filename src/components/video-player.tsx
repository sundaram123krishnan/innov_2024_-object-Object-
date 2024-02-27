import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import LlamaAI from "llamaai";
import srtParser2 from "srt-parser-2";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { TextGenerateEffect } from "./ui/text-generate-effect";

type VideoMetadata = {
  description: string;
  name: string;
};

const VideoPlayer: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [isClipping, setIsClipping] = useState<boolean>(false);
  const [clipBlob, setClipBlob] = useState<string | null>(null);

  let mediaRecorder: MediaRecorder | null = null;

  const handleClipStart = () => {
    if (videoRef.current) {
      setStartTime(videoRef.current.currentTime);
      setIsClipping(true);
    }
  };

  const handleClipEnd = () => {
    if (videoRef.current) {
      setEndTime(videoRef.current.currentTime);
      setIsClipping(false);
    }
  };

  const handleGenerateClip = () => {
    if (clipBlob) {
      window.URL.revokeObjectURL(clipBlob);
    }

    if (videoRef.current && startTime < endTime) {
      try {
        // @ts-ignore
        const stream = videoRef.current.captureStream();
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm",
        });

        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const clipBlob = new Blob(chunks, { type: "video/webm" });
          setClipBlob(URL.createObjectURL(clipBlob));
        };

        mediaRecorder.start();

        videoRef.current.currentTime = startTime;

        setTimeout(() => {
          mediaRecorder?.stop();
        }, (endTime - startTime) * 1000);
      } catch (error) {
        console.error("Error capturing video:", error);
      }
    }
  };

  const [response, setResponse] = useState("");
  const [generatingResponse, setGeneratingResponse] = useState(false);

  const apiToken =
    "LL-dlIgQVFTLtpQ66uuFfPlW2DMMtbq317E8KmWvS3l6CQv7KB6zmBaeuVKPBfWlyrC";
  const llamaAPI = new LlamaAI(apiToken);

  const generateContext = async () => {
    setGeneratingResponse(true);
    const currentTime = videoRef.current?.currentTime as number;
    try {
      const response = await fetch(src.replace(".webm", ".srt"));
      const data = await response.text();
      const parser = new srtParser2();

      let srtArray = parser.fromSrt(data);
      srtArray = srtArray.filter((srt) => {
        return (
          srt.startSeconds <= currentTime &&
          srt.startSeconds >= currentTime - 30
        );
      });
      const apiRequestJson = {
        messages: [
          {
            role: "user",
            content: `Explain these subtitles: ${srtArray
              .map((srt) => srt.text)
              .join(";")}`,
          },
        ],
        stream: false,
      };
      const messages = await llamaAPI.run(apiRequestJson);
      setResponse(messages.choices[0].message.content);
    } catch (error) {
      setResponse(JSON.stringify(error));
    }
    setGeneratingResponse(false);
  };

  const [metadata, setMetadata] = useState<VideoMetadata>({
    description: "",
    name: "",
  });
  useEffect(() => {
    async function fetchJSON() {
      try {
        const response = await fetch(src.replace(".webm", ".json"));
        const data: VideoMetadata = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchJSON();
  }, [src]);

  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-2 justify-items-center p-10">
      <div className="flex flex-col col-span-2 gap-6">
        <video controls ref={videoRef}>
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="flex flex-col">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {metadata.name}
          </h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            {metadata.description}
          </p>
        </div>
      </div>
      <Tabs defaultValue="context" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="context">Context</TabsTrigger>
          <TabsTrigger value="clips">Clips</TabsTrigger>
        </TabsList>
        <TabsContent value="context">
          <Card>
            <CardHeader>
              <CardTitle>Get help with context</CardTitle>
              <CardDescription>Use AI to explain the scene!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <ScrollArea className="h-[300px] w-full">
                {response ? <TextGenerateEffect words={response} /> : null}
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => generateContext()}
                disabled={generatingResponse}
              >
                {generatingResponse ? (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Generate context
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="clips">
          <Card>
            <CardHeader>
              <CardTitle>Create short clips</CardTitle>
              <CardDescription>
                Download short clips to share with your friends!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <ScrollArea className="h-[300px] w-full">
                {clipBlob && (
                  <div className="flex flex-col">
                    <video controls>
                      <source src={clipBlob} type="video/webm" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex gap-2">
              {isClipping ? (
                <div>
                  <Button onClick={handleClipEnd} variant="secondary">
                    End Clip
                  </Button>
                </div>
              ) : (
                <Button onClick={handleClipStart} variant="secondary">
                  Start Clip
                </Button>
              )}
              {startTime < endTime ? (
                <Button onClick={handleGenerateClip}>Generate Clip</Button>
              ) : null}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoPlayer;
