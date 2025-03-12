import { NextRequest, NextResponse } from "next/server";
import { utapi } from "../core";

export async function DELETE(req: NextRequest) {
  try {
    // Get file key from request
    const { fileUrl } = await req.json();

    console.log({ fileUrl });

    const fileKey = fileUrl.replace('https://utfs.io/f/', '');

    if (!fileKey) {
      return NextResponse.json({ error: "No file key provided" }, { status: 400 });
    }

    // Delete the file using UTApi
    const res = await utapi.deleteFiles(fileKey);

    console.log({res});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
} 