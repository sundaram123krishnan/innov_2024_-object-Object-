import { useState } from "react";
import LlamaAI from "llamaai";
import { Button } from "./ui/button";

export default function LlamaPrompt({ videoFile }: { videoFile: string }) {
  videoFile = videoFile.replace(".webm", ".srt");
  

  return <Button>Generate context</Button>;
}

// 533713f1-bb41-4363-ae1c-96d1194cfe24
// vMcwLS82mNX6NYg3k+TQxaRzMIalsKZaehXmDUH4pDf9d066Ulzh9vgM9/OlC5UUIxeRe/9EMKr
