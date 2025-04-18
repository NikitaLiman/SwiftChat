import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";

export async function PATCH(req: NextRequest) {
  const { userId, contactId } = await req.json();
  try {
    if (userId === contactId)
      return NextResponse.json({ message: "UserId & contactId are same" });
    const accepted = await prisma.contacts.updateMany({
      where: {
        userId: userId,
        contactId: contactId,
      },
      data: {
        accepted: true,
      },
    });
    return NextResponse.json(accepted);
  } catch (error) {
    return NextResponse.json({ message: "ERROR[POST]", status: 500 });
  }
}
