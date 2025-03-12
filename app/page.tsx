'use client';

import { useState, useEffect } from 'react';
import { UploadDropzone } from '@uploadthing/react';
import { OurFileRouter } from './api/uploadthing/core';

interface FileInfo {
  fileKey: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

export default function Home() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Load files
  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/files');
      
      if (!response.ok) {
        throw new Error('Failed to load files');
      }
      
      const data = await response.json();
      console.log("Received files data:", data);
      setFiles(data);
      setError(null);
    } catch (err) {
      console.error('Error loading files:', err);
      setError('Failed to load files. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Load files on component mount
  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Phoodle MP3 Uploader</h1>
        <p className="text-gray-600 dark:text-gray-400">Upload and manage your MP3 files</p>
      </header>

      <main className="flex-1 flex flex-col gap-8">
        {/* Upload section */}
        <section className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Upload New MP3</h2>
          <div className="max-w-md">
            <div className="cursor-pointer hover:opacity-90">
              <UploadDropzone<OurFileRouter, "mp3Upload">
                endpoint="mp3Upload"
                onClientUploadComplete={(res) => {
                  console.log('Upload completed, full response:', res);
                  alert('MP3 file successfully uploaded!');
                  window.location.reload(); // Refresh the page after upload
                }}
                onUploadError={(error: { message: string }) => {
                  console.error('Upload error:', error);
                  alert(`Error: ${error.message}`);
                }}
                config={{ mode: "auto" }}
                appearance={{
                  label: "Drop MP3 file here or click to browse",
                  allowedContent: "Audio files only (MP3)",
                  uploadIcon: { color: "rgb(37 99 235)" },
                  container: {
                    marginBottom: "1rem",
                    maxHeight: "200px",  // Limit height
                    padding: "1rem",     // Reduce padding
                  },
                  button: {
                    padding: "0.5rem 1rem", // Smaller button
                  }
                }}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supported file: MP3 (.mp3) - Max file size: 128MB
            </p>
          </div>
        </section>

        {/* Files list section */}
        <section className="flex-1">
          <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <p>Loading files...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No MP3 files uploaded yet.</p>
              <p className="mt-4 text-xs">
                <button 
                  onClick={loadFiles} 
                  className="text-blue-500 hover:underline"
                >
                  Refresh files
                </button>
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      File Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Uploaded At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {files.map((file) => (
                    <tr key={file.fileKey} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{file.fileName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.fileSize)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(file.uploadedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          Open
                        </a>
                        <button
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 mr-4"
                          onClick={() => {
                            navigator.clipboard.writeText(file.fileUrl);
                            alert('URL copied to clipboard!');
                          }}
                        >
                          Copy URL
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          onClick={async () => {
                            if (confirm(`Are you sure you want to delete "${file.fileName}"?`)) {
                              try {
                                const response = await fetch(`/api/uploadthing/delete/${file.fileKey}`, {
                                  method: 'DELETE',
                                });
                                
                                if (response.ok) {
                                  alert('File deleted successfully');
                                  window.location.reload(); // Refresh the page after deletion
                                } else {
                                  alert('Failed to delete file');
                                }
                              } catch (err) {
                                console.error('Error deleting file:', err);
                                alert('Error deleting file');
                              }
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Phoodle MP3 Uploader - Built with Next.js and UploadThing</p>
        <button 
          onClick={loadFiles}
          className="mt-2 text-blue-500 text-xs hover:underline"
        >
          Refresh Files
        </button>
      </footer>
    </div>
  );
}
