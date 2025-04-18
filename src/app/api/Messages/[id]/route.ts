import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const query = (await searchParams.get("q")?.trim()) || "";
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json({ message: "Didnt find chatId" });
    }

    const searchMessages = await prisma.message.findMany({
      where: {
        chatId: Number(chatId),
        text: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            fullname: true,
            avatar: true,
          },
        },
        replyTo: {
          include: {
            sender: {
              select: {
                fullname: true,
              },
            },
          },
        },
      },
    });
    if (!searchMessages) {
      return NextResponse.json({ message: "Error with searchMessages" });
    }

    return NextResponse.json(searchMessages);
  } catch (e) {
    console.log(e, "error");
    return NextResponse.json({ status: 500 });
  }
};
