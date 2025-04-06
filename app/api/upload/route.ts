import { NextRequest, NextResponse } from "next/server";
import { saveUploadedFile } from "@/lib/image-upload";

export async function POST(request: NextRequest) {
  try {
    // Get form data from the request
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    // Validate file existence
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Save the file and get the URL
    const { url, error } = await saveUploadedFile(file);

    // Handle any errors
    if (error) {
      return NextResponse.json(
        { error },
        { status: 400 }
      );
    }

    // Return success with the file URL
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error processing upload:", error);
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    );
  }
}

// Define the maximum file size (4MB)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};
