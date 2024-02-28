import clientPromise from "@/lib/mongodb";
import { auth } from "../../../../auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json("Not logged in", { status: 403 });
  }

  const filename: string = await request.json();

  try {
    const client = await clientPromise;
    await client
      .db()
      .collection<WatchHistory>("watchHistory")
      .insertOne({
        userId: session.user.id,
        timestamp: Number(new Date()),
        videoName: filename,
      });
    return Response.json("Added to history", { status: 200 });
  } catch (error) {
    return Response.json(JSON.stringify(error), { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json("Not logged in", { status: 403 });
  }

  try {
    const client = await clientPromise;
    const userWatchHistory = await client
      .db()
      .collection<WatchHistory>("watchHistory")
      .find({ userId: session.user.id })
      .toArray();
    return Response.json(userWatchHistory, { status: 200 });
  } catch (error) {
    return Response.json(JSON.stringify(error), { status: 500 });
  }
}
