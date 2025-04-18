import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";

export async function DELETE(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    const parts = pathname.split("/");
    const chatId = parts[parts.length - 1];

    console.log("Received chatId:", chatId);

    if (!chatId) {
      return NextResponse.json("Chat ID is required", { status: 400 });
    }

    const id = Number(chatId);
    if (isNaN(id)) {
      return NextResponse.json("Invalid Chat ID", { status: 400 });
    }
    await prisma.message.deleteMany({
      where: {
        chatId: id,
      },
    });

    await prisma.chatUser.deleteMany({
      where: {
        chatId: id,
      },
    });

    const deletedChat = await prisma.chat.delete({
      where: { id: id },
    });

    return NextResponse.json(deletedChat, { status: 200 });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { message: "Failed to delete chat" },
      { status: 500 }
    );
  }
}
