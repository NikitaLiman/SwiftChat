import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";

export const POST = async (req: NextRequest) => {
  try {
    const { currentUserId, targetUserId } = await req.json();
    console.log(currentUserId, targetUserId, "ids");

    if (currentUserId === targetUserId) {
      return NextResponse.json({ message: "UserId & contactId are same" });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json({
        message: "Target user not found",
        status: 404,
      });
    }

    const existingContact = await prisma.contacts.findFirst({
      where: {
        OR: [
          {
            userId: currentUserId,
            contactId: targetUserId,
          },
          {
            userId: targetUserId,
            contactId: currentUserId,
          },
        ],
      },
    });

    if (existingContact) {
      return NextResponse.json({
        message: "Contact already exists",
        status: 400,
      });
    }

    const contact = await prisma.contacts.create({
      data: {
        userId: currentUserId,
        contactId: targetUserId,
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Ошибка при создании контакта:", error);
    return NextResponse.json({ message: "ERROR[POST]", status: 500 });
  }
};
