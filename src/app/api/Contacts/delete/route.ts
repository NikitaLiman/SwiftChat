import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const contactId = searchParams.get("contactId");

  if (!userId || !contactId) {
    return new Response("Missing parameters", { status: 400 });
  }

  try {
    const deleted = await prisma.contacts.deleteMany({
      where: {
        userId: Number(userId),
        contactId: Number(contactId),
      },
    });

    return new Response(JSON.stringify(deleted), { status: 200 });
  } catch (error) {
    return new Response("Failed to delete contact", { status: 500 });
  }
}
