import { NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'pinkypow';

    if (!file) {
      return NextResponse.json({ error: 'No file provided in the request.' }, { status: 400 });
    }

    // Convert the File object to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Stream the buffer to Cloudinary
    const secureUrl = await uploadImageToCloudinary(buffer, folder);

    return NextResponse.json({
      success: true,
      url: secureUrl,
    });
  } catch (error: any) {
    console.error('File Upload API Error:', error);
    return NextResponse.json(
      { error: error.message || 'File upload failed.' },
      { status: 500 }
    );
  }
}
