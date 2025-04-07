"use server";

import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

// Configure upload directory
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Validates file based on type and size
 */
export async function validateFile(
  file: File,
  maxSizeInMB = 4,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
): Promise<{ valid: boolean; error?: string }> {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file size (convert MB to bytes)
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: `File too large. Maximum size allowed is ${maxSizeInMB}MB.`,
    };
  }

  return { valid: true };
}

/**
 * Saves an uploaded file to the server and returns its URL
 */
export async function saveUploadedFile(
  file: File,
  folderName = 'uploads'
): Promise<{ url: string; error?: string }> {
  try {
    // Validate file
    const validation = await validateFile(file);
    if (!validation.valid) {
      return { url: '', error: validation.error };
    }

    // Generate a unique filename
    const uniqueId = uuidv4();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${uniqueId}.${fileExtension}`;
    
    // Define the destination path
    const targetDir = path.join(process.cwd(), 'public', folderName);
    
    // Ensure directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    const filePath = path.join(targetDir, fileName);
    
    // Convert to buffer and save
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    
    // Return the public URL
    return { url: `/${folderName}/${fileName}` };
  } catch (error) {
    console.error('Error saving uploaded file:', error);
    return { url: '', error: 'Failed to save file. Please try again.' };
  }
}

/**
 * Deletes an uploaded file from the server
 */
export async function deleteUploadedFile(fileUrl: string): Promise<boolean> {
  try {
    // Extract filename from URL
    const filePath = path.join(process.cwd(), 'public', fileUrl);
    
    // Check if file exists before attempting to delete
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
} 