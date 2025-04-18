import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
export const config = {
  api: {
    bodyParser: false,
  },
};
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(process.cwd(), "public/uploads", file.name);

    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${file.name}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
