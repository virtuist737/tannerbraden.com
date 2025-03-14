import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file: Express.Multer.File, folder: string) => {
  try {
    // Convert the buffer to base64
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    // Upload to Cloudinary with optimization settings
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: `portfolio/${folder}`,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
      responsive: true,
      width: 'auto',
      dpr: 'auto',
      crop: 'limit',
      max_width: 2000,
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

export const getPublicIdFromUrl = (url: string): string => {
  const splitUrl = url.split('/');
  const filename = splitUrl[splitUrl.length - 1];
  const publicId = filename.split('.')[0];
  return publicId;
};