import { NextRequest, NextResponse } from 'next/server';
import { deleteFile } from '../../core';
import { cookies } from 'next/headers';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { fileKey: string } }
) {
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
    
    const { fileKey } = params;
    
    if (!fileKey) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      );
    }
    
    // Delete the file
    await deleteFile(fileKey);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
} 