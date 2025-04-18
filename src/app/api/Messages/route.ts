import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";

export async function POST(req: NextRequest) {
  const { text, senderId, chatId } = await req.json();
  try {
    if (!chatId || !senderId || !text) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const message = await prisma.message.create({
      data: {
        senderId,
        text,
        chatId,
      },
    });
    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");
  if (!chatId) {
    return NextResponse.json("ChatId doesnt exists");
  }

  try {
    const getMessages = await prisma.message.findMany({
      where: { chatId: parseInt(chatId) },
      include: {
        sender: true,
        replyTo: {
          include: {
            sender: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(getMessages);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
