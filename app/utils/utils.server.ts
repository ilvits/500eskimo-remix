import cloudinary from 'cloudinary';
import { writeAsyncIterableToWritable } from '@remix-run/node';

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

export async function uploadImage(data: AsyncIterable<Uint8Array>) {
  if (!data) {
    throw new Error('No data provided');
  }

  if (!data[Symbol.asyncIterator]) {
    throw new Error('Data must be an async iterable');
  }
  const options = {
    folder: 'productImages',
  };

  const uploadPromise = new Promise(async (resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
      console.log(result);
    });
    await writeAsyncIterableToWritable(data, uploadStream);
  });

  return uploadPromise;
}

// *** Delete folder ***
// export { uploadImage };
// cloudinary.api.delete_resources_by_prefix('{FORDER_NAME}', result => {
//   console.log(result);
// });

// *** Delete image ***
// cloudinary.v2.uploader
//   .destroy('{PUBLIC_ID}', { resource_type: 'image' })
//   .then(res => console.log(res))
//   .catch(console.error);
