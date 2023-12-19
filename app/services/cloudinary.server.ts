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

export const cloudinaryMoveImages = async ({
  productId,
  images,
  to,
}: {
  images: any;
  to: string;
  productId: number;
}) => {
  // console.log('image public id: ', images[0].publicId);
  // console.log('to: ', to + images[0].publicId.slice(images[0].publicId.lastIndexOf('/')));
  // console.log('productId: ', productId);

  await Promise.all(
    images.map(async (image: any) => {
      const updatedImages = await cloudinary.v2.uploader.rename(
        image.publicId,
        to + image.publicId.slice(image.publicId.lastIndexOf('/')),
        (result: any) => {
          console.log(result);
        }
      );
      return updatedImages;
    })
  )
    .then(result => {
      return result;
    })
    .catch(error => {
      console.log('error: ', error);
      return error;
    });
};

export const cloudinaryRemoveTag = async (publicIds: string[], tag: string) => {
  console.log('publicId: ', publicIds);
  console.log('tag: ', tag);
  await cloudinary.v2.uploader.remove_tag(tag, [...publicIds]).then(result => {
    console.log(result);
  });
  console.log('tags updated');
  return true;
};
