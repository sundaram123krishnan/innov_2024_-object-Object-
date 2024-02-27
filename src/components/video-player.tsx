import React, { useRef, useState } from 'react';
import { Button } from './ui/button';

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
          mimeType: 'video/webm',
        });

        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const clipBlob = new Blob(chunks, { type: 'video/webm' });
          setClipBlob(URL.createObjectURL(clipBlob));
        };

        mediaRecorder.start();

        videoRef.current.currentTime = startTime;

        setTimeout(() => {
          mediaRecorder?.stop();
        }, (endTime - startTime) * 1000);
      } catch (error) {
        console.error('Error capturing video:', error);
      }
    }
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
