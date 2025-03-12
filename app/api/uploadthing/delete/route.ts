import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import { utapi } from "../core";

export async function DELETE(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session?.jwt) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
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