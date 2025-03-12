import { NextResponse } from 'next/server';
import { utapi } from '../uploadthing/core';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const authenticated = cookieStore.get('authenticated')?.value === 'true';
    
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the files from UploadThing with pagination
    const filesResponse = await utapi.listFiles({
      limit: 100, // Increase limit to get more files
    });
    
    // Log the response for debugging
    console.log("Files response:", JSON.stringify(filesResponse, null, 2));
    
    // Filter for audio files
    const audioFiles = filesResponse.files.filter(file => 
      // Check filename instead of key
      (file.name && 
        (file.name.toLowerCase().endsWith('.mp3') || 
         file.name.toLowerCase().includes('mp3'))) ||
      // Fallback to just include all files if we're having trouble
      file.status === 'Uploaded'
    );
    
    console.log("Filtered audio files:", JSON.stringify(audioFiles, null, 2));
    
    // Format the response
    const formattedFiles = audioFiles.map(file => {
      const formattedFile = {
        fileKey: file.key,
        fileName: file.name || file.key,
        fileUrl: `https://utfs.io/f/${file.key}`, // Use the utfs.io URL format
        fileSize: file.size,
        uploadedAt: new Date(file.uploadedAt).toISOString(),
      };
      console.log("Formatted file:", formattedFile);
      return formattedFile;
    });
    
    console.log("Final formatted files:", JSON.stringify(formattedFiles, null, 2));
    
    return NextResponse.json(formattedFiles);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files', details: String(error) },
      { status: 500 }
    );
  }
} 