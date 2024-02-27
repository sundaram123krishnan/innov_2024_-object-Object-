import { Button } from "@/components/ui/button";
import { auth } from "../../../auth";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { UserButtonComponent } from "./user-button-component";

export function UserButton() {
  return (
    <Suspense fallback={<UserButtonSkeleton />}>
      <UserButtonWrapper />
    </Suspense>
  );
}

function UserButtonSkeleton() {
  return (
    <Button variant="ghost" className="p-1.5">
      <Skeleton className="w-[26px] h-[26px] rounded-full" />
    </Button>
  );
}

async function UserButtonWrapper() {
  const session = await auth();
  return <UserButtonComponent session={session} />;
}
