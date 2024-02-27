import Image from "next/image";
import { ModeToggle } from "./ui/mode-toggle";
import { MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import Link from "next/link";
import { UserButton } from "./user-button/user-button";

export default function Navbar() {
  return (
    <div className="flex w-full border-b items-center p-4 gap-2">
      <Link href="/" className="px-4">
        <Image
          src="/favicon.png"
          className="dark:invert invert-0 p-1"
          alt="logo"
          width={40}
          height={40}
        />
      </Link>

      <Button variant="link">
        <Link href="/" className="px-4 text-xl font-bold">
          Home
        </Link>
      </Button>
      <Button variant="link" className="mr-auto px-4">
        <Link href="/watch_later" className="px-4 text-xl font-bold">
          Watch later
        </Link>
      </Button>
      <ModeToggle />
      <UserButton />
    </div>
  );
}
