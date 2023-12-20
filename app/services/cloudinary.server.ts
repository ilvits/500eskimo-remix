import cloudinary from 'cloudinary';

export const uploadImagesToCloudinary = async (data: object[]) => {
  // console.log('data: ', data);

  const uploadedImages = await Promise.all(
    data.map(async image => {
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
  // console.log('uploadedImages: ', uploadedImages);

  return uploadedImages;
};

export const cloudinaryMoveImages = async ({ images, to }: { images: any; to: string }) => {
  return await Promise.all(
    images.map(async (image: any) => {
      return await cloudinary.v2.uploader.rename(
        image.publicId,
        to + image.publicId.slice(image.publicId.lastIndexOf('/'))
      );
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
