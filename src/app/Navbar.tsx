"use client";
import React, { useState } from "react";
import {
  // HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
} from "../components/ui/navbar-menu";
import { cn } from "../../utils/cn";

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Home"></MenuItem>
        <MenuItem setActive={setActive} active={active} item="Browse">
          <div className="  text-sm grid grid-cols-2 gap-10 p-4"></div>
        </MenuItem>
        <MenuItem
          setActive={setActive}
          active={active}
          item="Sign In"
        ></MenuItem>
      </Menu>
    </div>
  );
}
