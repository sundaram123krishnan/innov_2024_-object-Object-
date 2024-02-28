"use client";

import * as React from "react";
import { Check, SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import Link from "next/link";

export function VideoSearchBox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const [allMetadata, setAllMetadata] = React.useState<VideoMetadata[]>([]);
  React.useEffect(() => {
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value
            ? allMetadata.find((video) => video.name === value)?.name
            : "Search for a video"}
          <SearchIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <ScrollArea className="h-[400px] w-[300px] rounded-md border p-4">
          <Command>
            <CommandInput placeholder="Search" />
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {allMetadata.map((metadata, idx) => (
                <CommandItem
                  key={metadata.name}
                  value={metadata.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Button variant="link">
                    <Link href={`/video/stock-video-${idx + 1}.webm`}>
                      {metadata.name}
                    </Link>
                  </Button>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
