import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";
    const curUser = searchParams.get("userId");
    const userId = curUser ? parseInt(curUser, 10) : null;

    if (query.length < 1) return NextResponse.json([]);

    const WhereClause: any = {
      fullname: { contains: query, mode: "insensitive" },
    };

    if (userId !== null && !isNaN(userId)) {
      WhereClause.id = { not: userId };
    }

    const users = await prisma.user.findMany({
      where: WhereClause,
      select: { fullname: true, id: true, avatar: true },
      take: 10,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.log("Fault search:", error);
    return NextResponse.json({ error: "Error server" }, { status: 500 });
  }
};
