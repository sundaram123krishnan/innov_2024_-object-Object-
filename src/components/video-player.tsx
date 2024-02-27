import React, { useRef, useState } from "react";

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [isClipping, setIsClipping] = useState<boolean>(false);
  const [clipBlob, setClipBlob] = useState<string | null>(null);

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

  const handleGenerateClip = async () => {
    if (clipBlob) {
      window.URL.revokeObjectURL(clipBlob);
    }

    if (videoRef.current && startTime < endTime) {
      try {
        const stream = await captureStreamBetweenTimes(
          videoRef.current,
          startTime,
          endTime
        );

        const mediaRecorder = new MediaRecorder(stream, {
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

        setTimeout(() => {
          mediaRecorder.stop();
        }, (endTime - startTime) * 1000);
      } catch (error) {
        console.error("Error capturing video:", error);
      }
    }
  };

  const captureStreamBetweenTimes = (
    video: HTMLVideoElement,
    startTime: number,
    endTime: number
  ): Promise<MediaStream> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      const stream = canvas.captureStream();

      const captureFrame = (time: number) => {
        if (video.currentTime >= endTime) {
          clearInterval(intervalId);
          resolve(stream);
        } else {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
      };

      const intervalId = setInterval(captureFrame, 100, startTime);

      video.currentTime = startTime;
    });
  };

  return (
    <div className="video-player">
      <video controls ref={videoRef}>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {isClipping ? (
        <div>
          <p>Clipping...</p>
          <button onClick={handleClipEnd}>End Clip</button>
        </div>
      ) : (
        <button onClick={handleClipStart}>Start Clip</button>
      )}
      <button onClick={handleGenerateClip}>Generate Clip</button>
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
