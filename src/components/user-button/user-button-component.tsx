"use client";

import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";

type ComponentProps = {
  session: Session | null;
};

const providersAndIcons = [{ provider: "google", icon: "ri:google-fill" }];

function getInitials(name?: string | null) {
  if (!name) return "";
  const words = name.split(" ");
  const initials = words.map((word) => word.charAt(0).toUpperCase());
  return initials.join("");
}

export function UserButtonComponent({ session }: ComponentProps) {
  if (!session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Sign in</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {providersAndIcons.map(({ provider, icon }) => {
            return (
              <DropdownMenuItem
                asChild
                key={provider}
                onClick={() => signIn(provider)}
              >
                <Button variant="ghost" className="gap-2 w-full justify-start">
                  <Icon icon={icon} width="24px" height="24px" />
                  <span className="capitalize">{provider}</span>
                </Button>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="px-1.5"
            aria-label="profile-button"
          >
            <Avatar className="w-[26px] h-[26px]">
              <AvatarImage
                src={session.user.image ?? undefined}
                alt="profile-picture"
              />
              <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem className="text-red-500" onClick={() => signOut()}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
