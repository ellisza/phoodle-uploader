import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";

// Create a new instance without custom token
export const utapi = new UTApi();

export const deleteFile = async (file: string) => {
  await utapi.deleteFiles(file);
}
 
const f = createUploadthing();

// Middleware to check authentication
const isAuthenticated = async () => {
  const cookieStore = await cookies();
  const authenticated = cookieStore.get('authenticated')?.value === 'true';
  
  if (!authenticated) {
    throw new Error("Unauthorized");
  }
  
  return {}; // Return empty object instead of authentication data
};
 
export const ourFileRouter = {
  // Define MP3 upload endpoint
  mp3Upload: f({ audio: { maxFileSize: "128MB" } })
    .middleware(async () => {
      await isAuthenticated(); // Check authentication but don't return data
      return { uploader: "anonymous" }; // Simple metadata that won't cause issues
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload completed:", file);
      
      // Return file details for display
      return {
        fileKey: file.key,
        fileName: file.name,
        fileUrl: file.url,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
      };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;