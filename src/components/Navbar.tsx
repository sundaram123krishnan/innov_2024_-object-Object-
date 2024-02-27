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
    <div className="flex w-full border-b items-center p-2 gap-1">
      <Sheet>
        <SheetTrigger className="pl-2 pr-1">
          <MenuIcon strokeWidth={1.5} aria-label="menu-button" />
        </SheetTrigger>
        <SheetContent side="left">
          <SheetTitle className="flex items-center gap-2 mb-3">
            <Image
              src="/favicon.png"
              className="invert dark:invert-0"
              alt="logo"
              width={40}
              height={40}
            />
            <span className="text-xl font-bold">MyFit</span>
          </SheetTitle>
          <div className="flex flex-col items-start pl-4">
            <Button variant="link">
              <Link href="/exercise_splits">Exercise splits</Link>
            </Button>
            <Button variant="link">
              <Link href="/mesocycles">Mesocycles</Link>
            </Button>
            <Button variant="link">
              <Link href="/exercise_splits">Workouts</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/" className="mr-auto">
        <Image
          src="/favicon.png"
          className="invert dark:invert-0"
          alt="logo"
          width={40}
          height={40}
        />
      </Link>
      <ModeToggle />
      <UserButton />
    </div>
  );
}