import { ObjectId } from "mongodb";
import { auth } from "../../../../auth";
import clientPromise from "@/lib/mongodb";

type WatchLater = {
  userId: ObjectId;
  toWatchLater: string[];
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json("Not logged in", { status: 403 });
  }

  const watchLater: string = await request.json();

  try {
    const client = await clientPromise;
    const userWatchLater = await client
      .db()
      .collection<WatchLater>("watchLater")
      .findOne({ userId: new ObjectId(session.user.id) });

    if (userWatchLater === null) {
      await client
        .db()
        .collection<WatchLater>("watchLater")
        .insertOne({
          userId: new ObjectId(session.user.id),
          toWatchLater: [watchLater],
        });
    } else {
      await client
        .db()
        .collection<WatchLater>("watchLater")
        .updateOne(
          { userId: new ObjectId(session.user.id) },
          { $push: { toWatchLater: watchLater } }
        );
    }

    return Response.json("Added to watch later successfully", { status: 200 });
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
    const userWatchLater = await client
      .db()
      .collection<WatchLater>("watchLater")
      .findOne({ userId: new ObjectId(session.user.id) });
    return Response.json(userWatchLater, { status: 200 });
  } catch (error) {
    return Response.json(JSON.stringify(error), { status: 500 });
  }
}
