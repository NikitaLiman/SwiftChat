import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get("userId"));

    const send = await prisma.contacts.findMany({
      where: {
        userId: userId,
      },
      include: {
        contact: true,
      },
    });
    const received = await prisma.contacts.findMany({
      where: {
        contactId: userId,
      },
      include: {
        user: true,
      },
    });
    return NextResponse.json({ send, received });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "ERROR", status: 500 });
  }
};
