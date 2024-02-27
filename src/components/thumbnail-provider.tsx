import { useEffect, useRef, useState } from "react";

const ThumbnailGenerator: React.FC<{ videoSrc: string }> = ({ videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    const generateThumbnail = () => {
      const video = videoRef.current;
      if (video) {
        const randomTime = Math.random() * video.duration;
        video.currentTime = randomTime;
        video.addEventListener("seeked", () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailURL = canvas.toDataURL("image/png");
            setThumbnail(thumbnailURL);
          }
        });
      }
    };

    // Generate thumbnail when video is loaded
    const video = videoRef.current;
    if (video && video.readyState >= video.HAVE_ENOUGH_DATA) {
      generateThumbnail();
    } else {
      video?.addEventListener("loadeddata", generateThumbnail);
    }

    return () => {
      video?.removeEventListener("loadeddata", generateThumbnail);
    };
  }, [videoSrc]);

  return (
    <div>
      <video controls src={videoSrc} ref={videoRef} className="hidden" />
      {thumbnail && <img src={thumbnail} alt="Thumbnail" />}
    </div>
  );
};

export default ThumbnailGenerator;
