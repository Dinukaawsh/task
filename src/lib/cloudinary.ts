import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file: Express.Multer.File) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(file.path, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

export const deleteImage = async (publicId: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};
