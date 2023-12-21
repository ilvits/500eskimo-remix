import type { ImageStatus } from '@prisma/client';
import cloudinary from 'cloudinary';
import invariant from 'tiny-invariant';

export const uploadImagesToCloudinary = async (data: object[]) => {
  // console.log('data: ', data);

  const uploadedImages = await Promise.all(
    data.map(async (image: any) => {
      const uploadedImage = await cloudinary.v2.uploader.upload(
        image.base64,
        { folder: `temporary`, tags: ['TEMPORARY'], public_id: image.name, overwrite: true },
        function (error, result) {
          // console.log('uploadedImage: ', result);
          console.log('image uploaded');
          if (error) {
            console.log('error: ', error);
          }
        }
      );
      return uploadedImage;
    })
  );
  return uploadedImages;
};

export const cloudinaryMoveImages = async ({ images, to }: { images: any; to: string }) => {
  return await Promise.all(
    images.map(async (image: any) => {
      const uploadedImage = await cloudinary.v2.uploader.rename(
        image.publicId,
        to + image.publicId.slice(image.publicId.lastIndexOf('/'))
      );
      console.log(`image '${image.publicId}' moved to '${to}'`);
      return uploadedImage;
    })
  );
};

export const cloudinaryRemoveTag = async ({ publicIds, tag }: { publicIds: string[]; tag: string }) => {
  // console.log('publicId: ', publicIds);
  await cloudinary.v2.uploader.remove_tag(tag, [...publicIds]).then(result => {
    // console.log(result);
    console.log('tags updated');
    return result;
  });
};

export const cloudinaryDeleteImagesByStatus = async ({ status }: { status: keyof typeof ImageStatus }) => {
  const deletedImages = await cloudinary.v2.api.delete_resources_by_tag(status, (result: any) => {
    console.log(result);
  });
  invariant(deletedImages, 'Unable to delete product images');
  const result = await prisma.productImages.deleteMany({
    where: {
      status,
    },
  });
  console.log('result: ', result);
  return result;
};
