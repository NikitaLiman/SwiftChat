import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";

export async function POST(req: NextRequest) {
  try {
    const { currentUserId, TargetUserId } = await req.json();

    if (!currentUserId || !TargetUserId) {
      return NextResponse.json("Not users to make chat");
    }

    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          {
            users: {
              some: {
                userId: currentUserId,
              },
            },
          },
          {
            users: {
              some: {
                userId: TargetUserId,
              },
            },
          },
        ],
      },
      include: {
        users: true,
        messages: true,
      },
    });
    if (existingChat) {
      console.log("Chat already exists:", existingChat);
      return NextResponse.json({ chat: existingChat });
    }

    const newChat = await prisma.chat.create({
      data: {
        users: {
          create: [
            { user: { connect: { id: currentUserId } } },
            { user: { connect: { id: TargetUserId } } },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    console.log("New chat created:", newChat.id);
    return NextResponse.json({ chat: newChat });
  } catch (error) {
    console.error("Error creating chat:", error);
    throw new Error("Error creating chat");
  }
}

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    const existingChat = await prisma.chat.findMany({
      where: {
        users: {
          some: {
            userId: Number(userId),
          },
        },
      },
      include: {
        users: {
          include: {
            user: {
              include: {
                contactsReceived: true,
                contactsSent: true,
              },
            },
          },
        },
        messages: true,
      },
    });
    if (!existingChat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const updatedUserChat = existingChat.map((chat) => {
      const otherUser = chat.users.find(
        (user) => user.userId !== Number(userId)
      );
      if (otherUser) {
        return {
          ...chat,
          users: [otherUser],
        };
      }
      return chat;
    });
    return NextResponse.json({ chats: updatedUserChat });
  } catch (error) {
    console.error("Fault chat getting:", error);
  }
};
