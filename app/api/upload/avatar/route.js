import { v2 as cloudinary } from 'cloudinary';
import { authenticateToken } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    // Authenticate user
    let userData;
    try {
      userData = authenticateToken();
    } catch (err) {
      return Response.json({ error: err.message }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'pladivo/avatars',
          public_id: `user_${userData.user_id}`,
          overwrite: true,
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return Response.json(
      {
        message: 'Upload successful',
        url: result.secure_url,
        public_id: result.public_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    );
  }
}
