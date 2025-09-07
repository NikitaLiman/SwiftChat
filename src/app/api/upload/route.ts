import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { prisma } from "../../../../prisma/prisma-client";
export const config = {
  api: {
    bodyParser: false,
  },
};
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const email = formData.get("email") as string;
    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    let cvBase64: string | null = null;
    let mimeType: string | null = null;
    let originalFileName: string | null = null;

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      cvBase64 = buffer.toString("base64");
      mimeType = file.type;
      originalFileName = file.name;
    }
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: {
        cvBase64,
        mimeType,
        originalFileName,
      },
    });

    return NextResponse.json({
      userId: updatedUser.id,
      cvBase64,
      mimeType,
      originalFileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
