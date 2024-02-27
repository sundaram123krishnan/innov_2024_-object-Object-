import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import LlamaAI from "llamaai";
import srtParser2 from "srt-parser-2";
import { ReloadIcon } from "@radix-ui/react-icons";

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

  return (
    <div className="video-player">
      <video controls ref={videoRef}>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Button onClick={() => generateContext()} disabled={generatingResponse}>
        {generatingResponse ? (
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Generate context
      </Button>
      {response ? (
        <article className="leading-7 [&:not(:first-child)]:mt-6 prose max-w-none">
          {response}
        </article>
      ) : null}
      {isClipping ? (
        <div>
          <p>Clipping...</p>
          <Button onClick={handleClipEnd}>End Clip</Button>
        </div>
      ) : (
        <Button onClick={handleClipStart}>Start Clip</Button>
      )}
      <Button onClick={handleGenerateClip}>Generate Clip</Button>
      {clipBlob && (
        <div>
          <p>Clip generated!</p>
          <video controls>
            <source src={clipBlob} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
