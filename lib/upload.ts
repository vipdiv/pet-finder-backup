import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const cloudinaryReady =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (cloudinaryReady) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

export async function uploadImage(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  if (cloudinaryReady) {
    const dataUri = `data:${file.type};base64,${bytes.toString('base64')}`;
    const res = await cloudinary.uploader.upload(dataUri, { folder: 'lawndale-registry' });
    return res.secure_url;
  }

  const filename = `${randomUUID()}-${file.name.replace(/\s+/g, '-')}`;
  const dir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), bytes);
  return `/uploads/${filename}`;
}
